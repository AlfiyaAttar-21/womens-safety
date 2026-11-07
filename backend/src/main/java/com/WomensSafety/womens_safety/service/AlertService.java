package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Alert;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.AlertRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    public Alert triggerSos(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = new Alert();
        alert.setUser(user);
        alert.setState(Alert.AlertState.TRIGGERED);

        Alert savedAlert = alertRepository.save(alert);
        
        // TODO: Trigger notification fan-out (SMS/Push notifications) here[cite: 4, 7]
        
        return savedAlert;
    }

    public Alert updateAlertState(Long alertId, Alert.AlertState newState) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        alert.setState(newState);
        return alertRepository.save(alert);
    }
}
