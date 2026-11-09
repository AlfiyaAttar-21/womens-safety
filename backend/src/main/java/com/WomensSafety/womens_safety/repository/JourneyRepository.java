
package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.SafeJourney;
import com.WomensSafety.womens_safety.entity.JourneyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JourneyRepository
        extends JpaRepository<SafeJourney, Long> {

    List<SafeJourney> findByStatus(JourneyStatus status);

    List<SafeJourney> findByStatusAndExpectedArrivalTimeBefore(
            JourneyStatus status,
            LocalDateTime time
    );

    Optional<SafeJourney> findByIdAndUserId(Long id, Long userId);
}
