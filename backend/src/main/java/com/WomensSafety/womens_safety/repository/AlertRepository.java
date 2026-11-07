package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserIdAndState(Long userId, Alert.AlertState state);
}