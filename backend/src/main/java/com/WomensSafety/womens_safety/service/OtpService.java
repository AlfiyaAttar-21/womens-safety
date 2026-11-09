package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.OtpVerification;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.OtpRepository;
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

    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpRepository otpRepository, PasswordEncoder passwordEncoder, SmsService smsService) {
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.smsService = smsService;
    }

    @Transactional
    public void sendOtp(String phoneNumber) {
        String code = String.format("%06d", random.nextInt(1_000_000));

        OtpVerification otp = otpRepository.findByPhoneNumber(phoneNumber)
                .orElseGet(OtpVerification::new);
        otp.setPhoneNumber(phoneNumber);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        otp.setAttempts(0);
        otpRepository.save(otp);

        smsService.send(phoneNumber, "Your Women's Safety Companion code is " + code
                + ". It expires in " + EXPIRY_MINUTES + " minutes.");
    }

    // noRollbackFor: the failed-attempt counter must still be saved when we throw
    @Transactional(noRollbackFor = ApiException.class)
    public void verifyOtp(String phoneNumber, String code) {
        OtpVerification otp = otpRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "No OTP requested for this number"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "OTP expired. Request a new one");
        }
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Too many attempts. Request a new OTP");
        }
        if (!passwordEncoder.matches(code, otp.getCodeHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Incorrect OTP");
        }
        otpRepository.delete(otp);
    }
}
