package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Alert;
import com.WomensSafety.womens_safety.entity.Alert.AlertState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Alert> findByIdAndUserId(Long id, Long userId);

    Optional<Alert> findByTrackingToken(String trackingToken);

    // The alert the user's own app should treat as active
    Optional<Alert> findFirstByUserIdAndStateNotAndFakeResolvedFalseOrderByCreatedAtDesc(Long userId, AlertState state);
}
