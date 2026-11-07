package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "helplines")
@Data
public class Helpline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String region;

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber;

    private String type;
}
