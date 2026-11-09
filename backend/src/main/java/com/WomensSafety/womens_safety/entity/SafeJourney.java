
package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "safe_journeys")
@Getter
@Setter
public class SafeJourney {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String destination;

    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime expectedArrivalTime;

    private LocalDateTime lastCheckInTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JourneyStatus status = JourneyStatus.ACTIVE;

    private LocalDateTime completedAt;

    private LocalDateTime sosTriggeredAt;

    @PrePersist
    protected void onCreate() {
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
    }
}
