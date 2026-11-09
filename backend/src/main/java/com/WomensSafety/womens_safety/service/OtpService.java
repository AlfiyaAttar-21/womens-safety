
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.OtpVerification;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.OtpRepository;

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
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;

    private final SecureRandom random = new SecureRandom();

    public OtpService(
            OtpRepository otpRepository,
            PasswordEncoder passwordEncoder,
            SmsService smsService) {

        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.smsService = smsService;
    }

    // Generate and send OTP
    @Transactional
    public void sendOtp(String phoneNumber) {

        LocalDateTime now = LocalDateTime.now();

        OtpVerification otp = otpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(OtpVerification::new);

        // Prevent frequent OTP resending
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

        // Send SMS only after database transaction commits
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {
                        try {
                            smsService.send(
                                    phoneNumber,
                                    "Your Women's Safety Companion code is "
                                            + code
                                            + ". It expires in "
                                            + EXPIRY_MINUTES
                                            + " minutes."
                            );
                        } catch (Exception e) {
                            logger.error(
                                    "Failed to send OTP SMS to registered number"
                            );
                        }
                    }
                }
        );
    }

    // Verify OTP
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

        // Delete OTP after successful verification
        otpRepository.delete(otp);
    }
}
