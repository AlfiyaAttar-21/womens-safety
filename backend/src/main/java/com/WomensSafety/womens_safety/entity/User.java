package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String normalPinHash;

    @Column(nullable = false)
    private String duressPinHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_USER;

    private boolean phoneVerified = false;

    // false = suspended (REQ-ADM-04)
    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}
