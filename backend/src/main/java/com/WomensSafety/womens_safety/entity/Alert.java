package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertState state = AlertState.TRIGGERED;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AlertState {
        TRIGGERED, NOTIFIED, ACKNOWLEDGED, RESOLVED
    }
}