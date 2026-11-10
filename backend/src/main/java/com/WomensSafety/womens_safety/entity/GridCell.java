package com.WomensSafety.womens_safety.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "grid_cells")
@Data
public class GridCell {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String geohashCell;

    private Double riskScore;

    private Double latitude;

    private Double longitude;

    private LocalDateTime lastCalculatedAt = LocalDateTime.now();
}