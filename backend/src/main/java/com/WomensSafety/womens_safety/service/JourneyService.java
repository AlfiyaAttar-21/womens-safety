
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.SafeJourney;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.entity.JourneyStatus;
import com.WomensSafety.womens_safety.repository.JourneyRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;

    public JourneyService(
            JourneyRepository journeyRepository,
            UserRepository userRepository) {

        this.journeyRepository = journeyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SafeJourney startJourney(Long userId, SafeJourney journey) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        journey.setUser(user);
        journey.setStatus(JourneyStatus.ACTIVE);

        return journeyRepository.save(journey);
    }

    @Transactional
    public SafeJourney completeJourney(Long journeyId) {

        SafeJourney journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new RuntimeException("Journey not found"));

        journey.setStatus(JourneyStatus.COMPLETED);
        journey.setCompletedAt(java.time.LocalDateTime.now());

        return journeyRepository.save(journey);
    }
}
