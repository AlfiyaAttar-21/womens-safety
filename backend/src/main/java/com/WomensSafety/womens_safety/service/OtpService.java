
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.OtpVerification;
import com.WomensSafety.womens_safety.entity.PasswordResetOtp;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.OtpRepository;
import com.WomensSafety.womens_safety.repository.PasswordResetOtpRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final OtpRepository otpRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final TextBeeService textBeeService;
    private final UserRepository userRepository;

    private final SecureRandom random = new SecureRandom();

    public OtpService(
            OtpRepository otpRepository,
            PasswordResetOtpRepository passwordResetOtpRepository,
            PasswordEncoder passwordEncoder,
            TextBeeService textBeeService,
            UserRepository userRepository) {

        this.otpRepository = otpRepository;
        this.passwordResetOtpRepository = passwordResetOtpRepository;
        this.passwordEncoder = passwordEncoder;
        this.textBeeService = textBeeService;
        this.userRepository = userRepository;
    }

    private String generateOtp() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    // Registration OTP through SMS
    @Transactional
    public void sendOtp(String phoneNumber) {

        LocalDateTime now = LocalDateTime.now();

        OtpVerification otp = otpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(OtpVerification::new);

        if (otp.getSentAt() != null &&
                otp.getSentAt()
                        .plusSeconds(RESEND_COOLDOWN_SECONDS)
                        .isAfter(now)) {

            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait 60 seconds before requesting another OTP"
            );
        }

        String code = generateOtp();

        otp.setPhoneNumber(phoneNumber);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(now.plusMinutes(EXPIRY_MINUTES));
        otp.setSentAt(now);
        otp.setAttempts(0);

        otpRepository.save(otp);

        textBeeService.sendSms(
                phoneNumber,
                "Your SafeHer registration OTP is " + code
                        + ". It expires in " + EXPIRY_MINUTES
                        + " minutes. Do not share it with anyone."
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

    // Forgot Password OTP through SMS
    @Transactional
    public void sendPasswordResetOtp(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.BAD_REQUEST,
                        "User not found"
                ));

        LocalDateTime now = LocalDateTime.now();

        PasswordResetOtp otp = passwordResetOtpRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(PasswordResetOtp::new);

        if (otp.getSentAt() != null &&
                otp.getSentAt()
                        .plusSeconds(RESEND_COOLDOWN_SECONDS)
                        .isAfter(now)) {
            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait 60 seconds before requesting another OTP"
            );
        }

        String code = generateOtp();

        otp.setPhoneNumber(phoneNumber);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(now.plusMinutes(EXPIRY_MINUTES));
        otp.setSentAt(now);
        otp.setAttempts(0);

        passwordResetOtpRepository.save(otp);

        textBeeService.sendSms(
                phoneNumber,
                "Your SafeHer password reset OTP is " + code
                        + ". It expires in " + EXPIRY_MINUTES
                        + " minutes. Do not share it with anyone."
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

        passwordResetOtpRepository.delete(otp);
    }
}
