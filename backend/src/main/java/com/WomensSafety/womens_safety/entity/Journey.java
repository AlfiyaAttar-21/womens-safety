package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "journeys")
@Data
public class Journey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String destination;
    private Integer expectedDurationMinutes;
    private LocalDateTime startTime = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private JourneyStatus status = JourneyStatus.ACTIVE;

    public enum JourneyStatus {
        ACTIVE, COMPLETED, ESCALATED_TO_SOS, EXPIRED
    }
}