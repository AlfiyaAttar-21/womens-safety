
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.JourneyStatus;
import com.WomensSafety.womens_safety.entity.SafeJourney;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.JourneyRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SafeJourneyService {

    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final AlertService alertService;

    public SafeJourneyService(
            JourneyRepository journeyRepository,
            UserRepository userRepository,
            AlertService alertService) {

        this.journeyRepository = journeyRepository;
        this.userRepository = userRepository;
        this.alertService = alertService;
    }

    // Start a safe journey
    @Transactional
    public SafeJourney startJourney(
            Long userId,
            String destination,
            LocalDateTime expectedArrivalTime) {

        if (destination == null || destination.isBlank()) {
            throw new IllegalArgumentException("Destination is required");
        }

        if (expectedArrivalTime == null ||
                !expectedArrivalTime.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Expected arrival time must be in the future");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        SafeJourney journey = new SafeJourney();

        journey.setUser(user);
        journey.setDestination(destination.trim());
        journey.setExpectedArrivalTime(expectedArrivalTime);
        journey.setStatus(JourneyStatus.ACTIVE);

        return journeyRepository.save(journey);
    }

    // Check in during the journey
    @Transactional
    public SafeJourney checkIn(Long journeyId, Long userId) {

        SafeJourney journey = journeyRepository
                .findByIdAndUserId(journeyId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Journey not found"));

        if (journey.getStatus() != JourneyStatus.ACTIVE) {
            throw new IllegalStateException("Journey is not active");
        }

        journey.setLastCheckInTime(LocalDateTime.now());

        return journeyRepository.save(journey);
    }

    // Complete a safe journey
    @Transactional
    public SafeJourney completeJourney(Long journeyId, Long userId) {

        SafeJourney journey = journeyRepository
                .findByIdAndUserId(journeyId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Journey not found"));

        if (journey.getStatus() != JourneyStatus.ACTIVE) {
            throw new IllegalStateException("Journey is not active");
        }

        journey.setStatus(JourneyStatus.COMPLETED);
        journey.setCompletedAt(LocalDateTime.now());

        return journeyRepository.save(journey);
    }

    // Cancel a safe journey
    @Transactional
    public SafeJourney cancelJourney(Long journeyId, Long userId) {

        SafeJourney journey = journeyRepository
                .findByIdAndUserId(journeyId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Journey not found"));

        if (journey.getStatus() != JourneyStatus.ACTIVE) {
            throw new IllegalStateException("Journey is not active");
        }

        journey.setStatus(JourneyStatus.CANCELLED);

        return journeyRepository.save(journey);
    }

    // Trigger SOS if the expected arrival time is missed
    @Transactional
    public void triggerMissedJourneySos(Long journeyId) {

        SafeJourney journey = journeyRepository.findById(journeyId)
                .orElseThrow(() ->
                        new RuntimeException("Journey not found"));

        if (journey.getStatus() != JourneyStatus.ACTIVE) {
            return;
        }

        journey.setStatus(JourneyStatus.SOS_TRIGGERED);
        journey.setSosTriggeredAt(LocalDateTime.now());

        journeyRepository.save(journey);

        alertService.triggerSos(journey.getUser().getId());
    }
}
