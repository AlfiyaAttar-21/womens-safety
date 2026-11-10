package com.WomensSafety.womens_safety.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String phoneNumber;

    private String otp;

    private String newPassword;

    private String confirmPassword;
}
