
package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

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
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertState state = AlertState.TRIGGERED;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Tracking token
    @Column(unique = true, length = 64)
    private String trackingToken;

    private LocalDateTime trackingExpiresAt;

    // Last known position
    private Double latitude;
    private Double longitude;
    private LocalDateTime locationUpdatedAt;

    // Duress PIN alert
    @Column(name = "is_high_priority")
    private boolean highPriority = false;

    // Fake resolved alert
    @Column(name = "is_fake_resolved")
    private boolean fakeResolved = false;

    private LocalDateTime notifiedAt;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;

    public enum AlertState {
        TRIGGERED,
        NOTIFIED,
        ACKNOWLEDGED,
        RESOLVED
    }
}
