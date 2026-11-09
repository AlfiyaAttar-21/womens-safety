package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.LiveTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LiveTrackingRepository
        extends JpaRepository<LiveTracking, Long> {

    Optional<LiveTracking> findByTokenHashAndActiveTrue(String tokenHash);

    Optional<LiveTracking> findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(
            Long userId);
}