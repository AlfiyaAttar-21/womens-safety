package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.OtpVerification;
import com.WomensSafety.womens_safety.entity.PasswordResetOtp;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.OtpRepository;
import com.WomensSafety.womens_safety.repository.PasswordResetOtpRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final Logger logger =
            LoggerFactory.getLogger(OtpService.class);

    private static final int MAX_ATTEMPTS = 5;
    private static final int EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final OtpRepository otpRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private final SecureRandom random = new SecureRandom();

    public OtpService(
            OtpRepository otpRepository,
            PasswordResetOtpRepository passwordResetOtpRepository,
            PasswordEncoder passwordEncoder,
            SmsService smsService,
            EmailService emailService,
            UserRepository userRepository) {

        this.otpRepository = otpRepository;
        this.passwordResetOtpRepository = passwordResetOtpRepository;
        this.passwordEncoder = passwordEncoder;
        this.smsService = smsService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    // Sends by email when the user has one, otherwise falls back to SMS
    private void deliver(
            String phoneNumber,
            String email,
            String subject,
            String message) {

        if (email != null && !email.isBlank()) {
            emailService.send(email, subject, message);
        } else {
            smsService.send(phoneNumber, message);
        }
    }

    private String emailFor(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .map(User::getEmail)
                .orElse(null);
    }

    // Registration OTP
    @Transactional
    public void sendOtp(String phoneNumber) {

        LocalDateTime now = LocalDateTime.now();

        OtpVerification otp = otpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(OtpVerification::new);

        if (otp.getSentAt() != null &&
                otp.getSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS)
                        .isAfter(now)) {

            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait 60 seconds before requesting another OTP"
            );
        }

        String code = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        otp.setPhoneNumber(phoneNumber);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(now.plusMinutes(EXPIRY_MINUTES));
        otp.setSentAt(now);
        otp.setAttempts(0);

        otpRepository.save(otp);

        String email = emailFor(phoneNumber);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {
                        try {
                            deliver(
                                    phoneNumber,
                                    email,
                                    "Your SafeHer verification code",
                                    "Your SafeHer verification code is "
                                            + code
                                            + ". It expires in "
                                            + EXPIRY_MINUTES
                                            + " minutes. Do not share it with anyone."
                            );
                        } catch (Exception e) {
                            logger.error(
                                    "Failed to send registration OTP: {}",
                                    e.getMessage()
                            );
                        }
                    }
                }
        );
    }

    // Verify Registration OTP
    @Transactional(noRollbackFor = ApiException.class)
    public void verifyOtp(String phoneNumber, String code) {

        OtpVerification otp = otpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.BAD_REQUEST,
                        "No OTP requested for this number"
                ));

        if (code == null || !code.matches("\\d{6}")) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "OTP must contain exactly 6 digits"
            );
        }

        if (otp.getExpiresAt() == null ||
                !otp.getExpiresAt().isAfter(LocalDateTime.now())) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "OTP expired. Request a new one"
            );
        }

        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many attempts. Request a new OTP"
            );
        }

        if (!passwordEncoder.matches(code, otp.getCodeHash())) {

            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Incorrect OTP"
            );
        }

        otpRepository.delete(otp);
    }

    // Send Password Reset OTP
    @Transactional
    public void sendPasswordResetOtp(String phoneNumber) {

        LocalDateTime now = LocalDateTime.now();

        PasswordResetOtp otp = passwordResetOtpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(PasswordResetOtp::new);

        if (otp.getSentAt() != null &&
                otp.getSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS)
                        .isAfter(now)) {

            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait 60 seconds before requesting another OTP"
            );
        }

        String code = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        otp.setPhoneNumber(phoneNumber);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(now.plusMinutes(EXPIRY_MINUTES));
        otp.setSentAt(now);
        otp.setAttempts(0);

        passwordResetOtpRepository.save(otp);

        String email = emailFor(phoneNumber);

        // Send after the database transaction commits
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {
                        try {
                            deliver(
                                    phoneNumber,
                                    email,
                                    "Your SafeHer password reset code",
                                    "Your SafeHer password reset OTP is "
                                            + code
                                            + ". It expires in "
                                            + EXPIRY_MINUTES
                                            + " minutes. Do not share it with anyone."
                            );
                        } catch (Exception e) {
                            logger.error(
                                    "Failed to send password reset OTP: {}",
                                    e.getMessage()
                            );
                        }
                    }
                }
        );
    }

    // Verify Password Reset OTP
    @Transactional(noRollbackFor = ApiException.class)
    public void verifyPasswordResetOtp(
            String phoneNumber,
            String code) {

        PasswordResetOtp otp = passwordResetOtpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.BAD_REQUEST,
                        "No password reset OTP requested for this number"
                ));

        if (code == null || !code.matches("\\d{6}")) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "OTP must contain exactly 6 digits"
            );
        }

        if (otp.getExpiresAt() == null ||
                !otp.getExpiresAt().isAfter(LocalDateTime.now())) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "OTP expired. Request a new one"
            );
        }

        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many attempts. Request a new OTP"
            );
        }

        if (!passwordEncoder.matches(code, otp.getCodeHash())) {

            otp.setAttempts(otp.getAttempts() + 1);
            passwordResetOtpRepository.save(otp);

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Incorrect OTP"
            );
        }

        // Delete OTP after successful verification
        passwordResetOtpRepository.delete(otp);
    }
}