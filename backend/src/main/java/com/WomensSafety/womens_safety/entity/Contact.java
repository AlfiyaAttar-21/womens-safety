package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "contacts")
@Data
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    private String email;
    private String relationship;

    @Enumerated(EnumType.STRING)
    private ConsentStatus consentStatus = ConsentStatus.PENDING;

    public enum ConsentStatus {
        PENDING, ACCEPTED
    }
}