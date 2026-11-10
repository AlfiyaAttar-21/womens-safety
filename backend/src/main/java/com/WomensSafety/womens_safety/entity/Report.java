
package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User user;

    private String title;

    private String category;

    @Column(length = 1000)
    private String description;

    private LocalDate incidentDate;

    private String location;

    private Integer aiSeverityScore;

    private Double latitude;

    private Double longitude;

    private String geohash;

    private LocalDateTime createdAt = LocalDateTime.now();
}
