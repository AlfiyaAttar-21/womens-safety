package com.WomensSafety.womens_safety.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContactRequest {

    @NotBlank @Size(max = 100)
    private String name;

    // 10-digit Indian mobile number
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String phone;

    @Email @Size(max = 150)
    private String email;

    @Size(max = 50)
    private String relationship;
}
