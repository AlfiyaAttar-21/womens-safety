package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.dto.*;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest req) {

        authService.register(req);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message",
                        "Registered. Enter the OTP sent to your email"
                ));
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public Map<String, String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest req) {

        authService.verifyOtp(req);

        return Map.of(
                "message",
                "Account verified. You can now log in"
        );
    }

    // Resend OTP
    @PostMapping("/resend-otp")
    public Map<String, String> resendOtp(
            @RequestBody Map<String, String> body) {

        authService.resendOtp(body.get("phoneNumber"));

        return Map.of("message", "OTP sent to your email");
    }

    // User Login
    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest req) {

        return authService.login(req);
    }

    // Refresh JWT Tokens
    @PostMapping("/refresh")
    public AuthResponse refresh(
            @Valid @RequestBody RefreshRequest req) {

        return authService.refresh(req.getRefreshToken());
    }

    // Forgot Password - Send OTP
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestBody ForgotPasswordRequest req) {

        authService.requestPasswordResetOtp(req.getPhoneNumber());

        return Map.of(
                "message",
                "If this verified account exists, a password reset OTP has been sent to its email."
        );
    }

    // Reset Password
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(
            @RequestBody ResetPasswordRequest req) {

        authService.resetPassword(
                req.getPhoneNumber(),
                req.getOtp(),
                req.getNewPassword(),
                req.getConfirmPassword()
        );

        return Map.of(
                "message",
                "Password reset successful. Please login with your new password."
        );
    }

    // Get Current Logged-in User
    @GetMapping("/me")
    public Map<String, Object> me(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return Map.of(
                "userId", user.getId()
        );
    }
}