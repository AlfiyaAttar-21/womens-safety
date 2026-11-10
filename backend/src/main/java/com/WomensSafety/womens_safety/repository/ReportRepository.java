package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Existing methods
    List<Report> findByGeohash(String geohash);

    List<Report> findByUser_IdOrderByCreatedAtDesc(Long userId);

    // New method: Get reports having location coordinates
    List<Report> findByLatitudeIsNotNullAndLongitudeIsNotNull();

    // New method: Get recent reports
    List<Report> findByCreatedAtAfterAndLatitudeIsNotNullAndLongitudeIsNotNull(
            LocalDateTime dateTime);
}