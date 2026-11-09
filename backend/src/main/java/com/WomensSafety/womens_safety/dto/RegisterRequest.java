package com.WomensSafety.womens_safety.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {

    @NotBlank @Size(max = 100)
    private String name;

    // 10-digit Indian mobile number
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String phoneNumber;

    @NotBlank @Size(min = 8, max = 64, message = "Password must be 8-64 characters")
    private String password;

    @NotBlank @Pattern(regexp = "^\\d{4,6}$", message = "PIN must be 4-6 digits")
    private String normalPin;

    @NotBlank @Pattern(regexp = "^\\d{4,6}$", message = "PIN must be 4-6 digits")
    private String duressPin;
}
