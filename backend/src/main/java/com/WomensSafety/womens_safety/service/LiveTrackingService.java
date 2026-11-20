
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.dto.LocationRequest;
import com.WomensSafety.womens_safety.entity.LiveTracking;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.Contact.ConsentStatus;
import com.WomensSafety.womens_safety.repository.LiveTrackingRepository;
import com.WomensSafety.womens_safety.repository.ContactRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LiveTrackingService {

    private final LiveTrackingRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final PasswordEncoder passwordEncoder;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final TextBeeService textBeeService;
    private final String frontendUrl;

    private final SecureRandom random = new SecureRandom();

    public LiveTrackingService(
            LiveTrackingRepository repository,
            SimpMessagingTemplate messagingTemplate,
            PasswordEncoder passwordEncoder,
            ContactRepository contactRepository,
            UserRepository userRepository,
            TextBeeService textBeeService,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {

        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
        this.passwordEncoder = passwordEncoder;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.textBeeService = textBeeService;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public Map<String, String> startTracking(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Stop previous active tracking session
        repository.findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .ifPresent(old -> {
                    old.setActive(false);
                    repository.save(old);
                });

        // Generate secure tracking token
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        // Create tracking session
        LiveTracking tracking = new LiveTracking();

        tracking.setUserId(userId);
        tracking.setTokenHash(passwordEncoder.encode(token));
        tracking.setCreatedAt(LocalDateTime.now());
        tracking.setExpiresAt(LocalDateTime.now().plusHours(2));
        tracking.setActive(true);

        repository.save(tracking);

        // Generate tracking URL
        String trackingUrl = frontendUrl + "/track/" + token;

        // Find accepted trusted contacts
        List<Contact> trustedContacts =
                contactRepository.findByUserIdAndConsentStatus(
                        userId, ConsentStatus.ACCEPTED);

        // Prepare journey notification
        String message = "SAFEHER JOURNEY ALERT! "
                + user.getName()
                + " has started a journey. "
                + "You can track their live location here: "
                + trackingUrl
                + " Tracking expires in 2 hours.";

        // Send SMS to accepted trusted contacts
        for (Contact contact : trustedContacts) {
            try {
                textBeeService.sendSms(contact.getPhone(), message);

                System.out.println(
                        "Journey tracking SMS sent to: "
                        + contact.getPhone());

            } catch (Exception e) {
                System.err.println(
                        "Failed to send journey SMS to: "
                        + contact.getPhone());

                e.printStackTrace();
            }
        }

        return Map.of(
                "message", "Live tracking started",
                "trackingToken", token,
                "trackingUrl", trackingUrl
        );
    }

    @Transactional
    public void updateLocation(Long userId, LocationRequest request) {

        LiveTracking tracking = repository
                .findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .orElseThrow(() ->
                        new RuntimeException("Tracking not active"));

        if (!tracking.getExpiresAt().isAfter(LocalDateTime.now())) {

            tracking.setActive(false);
            repository.save(tracking);

            throw new RuntimeException("Tracking session expired");
        }

        if (!passwordEncoder.matches(
                request.getTrackingToken(),
                tracking.getTokenHash())) {

            throw new RuntimeException("Invalid tracking token");
        }

        tracking.setLatitude(request.getLatitude());
        tracking.setLongitude(request.getLongitude());

        repository.save(tracking);

        String destination =
                "/topic/tracking/" + request.getTrackingToken();

        Map<String, Object> payload = new HashMap<>();

        payload.put("latitude", request.getLatitude());
        payload.put("longitude", request.getLongitude());
        payload.put("updatedAt", LocalDateTime.now().toString());

        Message<Object> message = MessageBuilder
                .withPayload((Object) payload)
                .build();

        messagingTemplate.send(destination, message);
    }

    public Map<String, Object> getPublicLocation(String token) {

        LiveTracking tracking = repository.findAll().stream()
                .filter(t -> t.isActive()
                        && t.getExpiresAt().isAfter(LocalDateTime.now())
                        && passwordEncoder.matches(
                                token, t.getTokenHash()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid or expired tracking link"));

        return Map.of(
                "latitude",
                tracking.getLatitude() == null
                        ? 0.0 : tracking.getLatitude(),

                "longitude",
                tracking.getLongitude() == null
                        ? 0.0 : tracking.getLongitude()
        );
    }

    @Transactional
    public void stopTracking(Long userId) {

        repository.findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .ifPresent(tracking -> {
                    tracking.setActive(false);
                    repository.save(tracking);
                });
    }
}
