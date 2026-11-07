package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.Journey;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.JourneyRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "*")
public class JourneyController {

    @Autowired
    private JourneyRepository journeyRepository;

    @Autowired
    private UserRepository userRepository;

    // Start a safe journey
    @PostMapping("/start/{userId}")
    public ResponseEntity<?> startJourney(@PathVariable Long userId, @RequestBody Journey journeyDetails) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        journeyDetails.setUser(userOpt.get());
        journeyDetails.setStatus(Journey.JourneyStatus.ACTIVE);

        Journey savedJourney = journeyRepository.save(journeyDetails);
        return ResponseEntity.ok(savedJourney);
    }

    // Mark journey completed / check-in safe
    @PutMapping("/{journeyId}/complete")
    public ResponseEntity<?> completeJourney(@PathVariable Long journeyId) {
        Optional<Journey> journeyOpt = journeyRepository.findById(journeyId);
        if (journeyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Journey journey = journeyOpt.get();
        journey.setStatus(Journey.JourneyStatus.COMPLETED);
        journeyRepository.save(journey);

        return ResponseEntity.ok("Journey marked as safe and completed.");
    }
}
