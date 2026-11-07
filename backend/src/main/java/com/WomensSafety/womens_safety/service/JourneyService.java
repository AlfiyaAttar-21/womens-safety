package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Journey;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.JourneyRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JourneyService {

    @Autowired
    private JourneyRepository journeyRepository;

    @Autowired
    private UserRepository userRepository;

    public Journey startJourney(Long userId, Journey journey) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        journey.setUser(user);
        journey.setStatus(Journey.JourneyStatus.ACTIVE);
        return journeyRepository.save(journey);
    }

    public Journey completeJourney(Long journeyId) {
        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new RuntimeException("Journey not found"));
        
        journey.setStatus(Journey.JourneyStatus.COMPLETED);
        return journeyRepository.save(journey);
    }
}
