
package com.WomensSafety.womens_safety.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.WomensSafety.womens_safety.entity.Alert;
import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.Contact.ConsentStatus;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.AlertRepository;
import com.WomensSafety.womens_safety.repository.ContactRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private TextBeeService textBeeService;

    public Alert triggerSos(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = new Alert();
        alert.setUser(user);
        alert.setState(Alert.AlertState.TRIGGERED);

        Alert savedAlert = alertRepository.save(alert);

        // Get only accepted trusted contacts
        List<Contact> trustedContacts =
                contactRepository.findByUserIdAndConsentStatus(
                        userId, ConsentStatus.ACCEPTED);

        // Prepare SOS message
        String message = "SOS ALERT! " + user.getName()
                + " has triggered an emergency alert. "
                + "Please contact them immediately at "
                + user.getPhoneNumber() + ".";

        // Send SMS to accepted trusted contacts
        for (Contact contact : trustedContacts) {

            try {
                textBeeService.sendSms(contact.getPhone(), message);

                System.out.println(
                        "SOS SMS sent to: " + contact.getPhone());

            } catch (Exception e) {

                System.err.println(
                        "Failed to send SOS SMS to: "
                        + contact.getPhone());

                e.printStackTrace();
            }
        }

        return savedAlert;
    }

    public Alert updateAlertState(
            Long alertId, Alert.AlertState newState) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setState(newState);

        return alertRepository.save(alert);
    }
}
