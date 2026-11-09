package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String phone;

    private String email;

    private String relationship;

    // Contact status (kept in sync with consentStatus)
    @Column(nullable = false)
    private String status = "PENDING";

    // Consent status (REQ-AUTH-04)
    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status")
    private ConsentStatus consentStatus = ConsentStatus.PENDING;

    // Long random token sent to the contact in the consent link
    @Column(unique = true, length = 64)
    private String consentToken;

    private LocalDateTime consentRequestedAt;

    public enum ConsentStatus {
        PENDING,
        ACCEPTED,
        OPTED_OUT
    }
}
