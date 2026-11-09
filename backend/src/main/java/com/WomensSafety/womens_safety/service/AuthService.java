
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.dto.*;
import com.WomensSafety.womens_safety.entity.Role;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.UserRepository;
import com.WomensSafety.womens_safety.security.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    // REQ-AUTH-01 and REQ-AUTH-05
    @Transactional
    public void register(RegisterRequest req) {

        if (userRepository.existsByPhoneNumber(req.getPhoneNumber())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Phone number already registered"
            );
        }

        if (Objects.equals(req.getNormalPin(), req.getDuressPin())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Duress PIN must be different from normal PIN"
            );
        }

        User user = new User();

        user.setName(req.getName().trim());
        user.setPhoneNumber(req.getPhoneNumber());

        user.setPasswordHash(
                passwordEncoder.encode(req.getPassword())
        );

        user.setNormalPinHash(
                passwordEncoder.encode(req.getNormalPin())
        );

        user.setDuressPinHash(
                passwordEncoder.encode(req.getDuressPin())
        );

        user.setRole(Role.ROLE_USER);

        userRepository.save(user);

        // Generate and send OTP
        otpService.sendOtp(user.getPhoneNumber());
    }

    // Resend OTP
    public void resendOtp(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (user.isPhoneVerified()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Phone already verified"
            );
        }

        otpService.sendOtp(phoneNumber);
    }

    // Verify OTP
    @Transactional(noRollbackFor = ApiException.class)
    public void verifyOtp(VerifyOtpRequest req) {

        User user = userRepository.findByPhoneNumber(req.getPhoneNumber())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        otpService.verifyOtp(
                req.getPhoneNumber(),
                req.getOtp()
        );

        user.setPhoneVerified(true);

        userRepository.save(user);
    }

    // REQ-AUTH-02: Login
    public AuthResponse login(LoginRequest req) {

        User user = userRepository.findByPhoneNumber(req.getPhoneNumber())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid phone number or password"
                ));

        if (!passwordEncoder.matches(
                req.getPassword(),
                user.getPasswordHash())) {

            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid phone number or password"
            );
        }

        if (!user.isPhoneVerified()) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "Verify your phone number with OTP first"
            );
        }

        if (!user.isActive()) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "Account suspended"
            );
        }

        return tokensFor(user);
    }

    // Refresh access and refresh tokens
    public AuthResponse refresh(String refreshToken) {

        try {

            Claims claims = jwtService.parseRefreshToken(refreshToken);

            Long userId = Long.valueOf(claims.getSubject());

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.UNAUTHORIZED,
                            "Invalid refresh token"
                    ));

            if (!user.isActive()) {
                throw new ApiException(
                        HttpStatus.FORBIDDEN,
                        "Account suspended"
                );
            }

            if (!user.isPhoneVerified()) {
                throw new ApiException(
                        HttpStatus.FORBIDDEN,
                        "Phone verification required"
                );
            }

            return tokensFor(user);

        } catch (JwtException | IllegalArgumentException e) {

            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired refresh token"
            );
        }
    }

    // Generate tokens
    private AuthResponse tokensFor(User user) {

        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getName()
        );
    }
}
