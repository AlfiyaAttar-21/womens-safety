
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.SafeJourney;
import com.WomensSafety.womens_safety.service.SafeJourneyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "*")
public class JourneyController {

    private final SafeJourneyService safeJourneyService;

    public JourneyController(SafeJourneyService safeJourneyService) {
        this.safeJourneyService = safeJourneyService;
    }

    // Request body for starting a journey
    public static class StartJourneyRequest {
        private String destination;
        private LocalDateTime expectedArrivalTime;

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public LocalDateTime getExpectedArrivalTime() {
            return expectedArrivalTime;
        }

        public void setExpectedArrivalTime(
                LocalDateTime expectedArrivalTime) {
            this.expectedArrivalTime = expectedArrivalTime;
        }
    }

    // Start a safe journey
    @PostMapping("/start/{userId}")
    public ResponseEntity<?> startJourney(
            @PathVariable Long userId,
            @RequestBody StartJourneyRequest request) {

        try {
            SafeJourney journey = safeJourneyService.startJourney(
                    userId,
                    request.getDestination(),
                    request.getExpectedArrivalTime()
            );

            return ResponseEntity.ok(journey);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Check in during journey
    @PutMapping("/{journeyId}/check-in/{userId}")
    public ResponseEntity<?> checkIn(
            @PathVariable Long journeyId,
            @PathVariable Long userId) {

        try {
            SafeJourney journey =
                    safeJourneyService.checkIn(journeyId, userId);

            return ResponseEntity.ok(journey);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Complete journey
    @PutMapping("/{journeyId}/complete/{userId}")
    public ResponseEntity<?> completeJourney(
            @PathVariable Long journeyId,
            @PathVariable Long userId) {

        try {
            SafeJourney journey =
                    safeJourneyService.completeJourney(journeyId, userId);

            return ResponseEntity.ok(
                    "Journey completed successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cancel journey
    @PutMapping("/{journeyId}/cancel/{userId}")
    public ResponseEntity<?> cancelJourney(
            @PathVariable Long journeyId,
            @PathVariable Long userId) {

        try {
            SafeJourney journey =
                    safeJourneyService.cancelJourney(journeyId, userId);

            return ResponseEntity.ok(
                    "Journey cancelled successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
