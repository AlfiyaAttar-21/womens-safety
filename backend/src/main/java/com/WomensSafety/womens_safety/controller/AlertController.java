package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.Alert;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.AlertRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    // Trigger an emergency SOS alert
    @PostMapping("/trigger/{userId}")
    public ResponseEntity<?> triggerAlert(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Alert alert = new Alert();
        alert.setUser(userOpt.get());
        alert.setState(Alert.AlertState.TRIGGERED);

        Alert savedAlert = alertRepository.save(alert);
        // TODO: Trigger asynchronous notification fan-out (SMS/Push notifications) here[cite: 4, 7]
        
        return ResponseEntity.ok(savedAlert);
    }

    // Update alert state (e.g., ACKNOWLEDGED or RESOLVED)[cite: 4, 5]
    @PutMapping("/{alertId}/state")
    public ResponseEntity<?> updateAlertState(@PathVariable Long alertId, @RequestParam Alert.AlertState newState) {
        Optional<Alert> alertOpt = alertRepository.findById(alertId);
        if (alertOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Alert alert = alertOpt.get();
        alert.setState(newState);
        Alert updatedAlert = alertRepository.save(alert);

        return ResponseEntity.ok(updatedAlert);
    }
}