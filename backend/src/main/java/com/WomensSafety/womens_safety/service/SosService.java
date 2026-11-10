package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.dto.AlertResponse;
import com.WomensSafety.womens_safety.dto.SosTriggerRequest;
import com.WomensSafety.womens_safety.dto.TrackingResponse;
import com.WomensSafety.womens_safety.entity.Alert;
import com.WomensSafety.womens_safety.entity.Alert.AlertState;
import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.AlertRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SosService {

    private static final Logger log = LoggerFactory.getLogger(SosService.class);
    private static final int TRACKING_HOURS = 24;

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final ContactService contactService;
    private final SmsService smsService;
    private final PasswordEncoder passwordEncoder;
    private final String frontendUrl;
    private final SecureRandom random = new SecureRandom();

    public SosService(AlertRepository alertRepository, UserRepository userRepository,
                      ContactService contactService, SmsService smsService,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.contactService = contactService;
        this.smsService = smsService;
        this.passwordEncoder = passwordEncoder;
        this.frontendUrl = frontendUrl;
    }

    // ---------------------------------------------------------------
    // REQ-SOS-01 / REQ-SOS-02: trigger and notify confirmed contacts.
    // This flow never calls an AI service.
    // ---------------------------------------------------------------
    @Transactional
    public AlertResponse trigger(Long userId, SosTriggerRequest req) {
        User user = findUser(userId);

        boolean alreadyActive = alertRepository
                .findFirstByUserIdAndStateNotAndFakeResolvedFalseOrderByCreatedAtDesc(userId, AlertState.RESOLVED)
                .isPresent();
        if (alreadyActive) {
            throw new ApiException(HttpStatus.CONFLICT, "You already have an active alert");
        }

        Alert alert = new Alert();
        alert.setUser(user);
        alert.setState(AlertState.TRIGGERED);
        alert.setTrackingToken(newToken());
        alert.setTrackingExpiresAt(LocalDateTime.now().plusHours(TRACKING_HOURS));
        if (req != null && req.getLatitude() != null && req.getLongitude() != null) {
            alert.setLatitude(req.getLatitude());
            alert.setLongitude(req.getLongitude());
            alert.setLocationUpdatedAt(LocalDateTime.now());
        }
        // Saved first, so the alert exists even if every SMS fails
        alertRepository.save(alert);

        String message = buildAlertMessage(user, alert);
        int sent = 0;
        for (Contact c : contactService.getConfirmedContacts(userId)) {
            if (safeSend(c.getPhone(), message)) {
                sent++;
            }
        }
        if (sent > 0) {
            alert.setState(AlertState.NOTIFIED);
            alert.setNotifiedAt(LocalDateTime.now());
            alertRepository.save(alert);
        }
        return AlertResponse.from(alert, sent);
    }

    @Transactional(readOnly = true)
    public Optional<AlertResponse> getActive(Long userId) {
        return alertRepository
                .findFirstByUserIdAndStateNotAndFakeResolvedFalseOrderByCreatedAtDesc(userId, AlertState.RESOLVED)
                .map(AlertResponse::from);
    }
    

    // Verify Normal PIN before showing SOS controls
    @Transactional(readOnly = true)
    public void verifyNormalPin(Long userId, String pin) {

        User user = findUser(userId);

        if (pin == null || pin.trim().isEmpty()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "PIN is required"
            );
        }
        String normalPinHash = user.getNormalPinHash();

        if (normalPinHash == null ||
                !passwordEncoder.matches(pin.trim(), normalPinHash)) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Incorrect normal PIN"
            );
        }
    }


    @Transactional(readOnly = true)
    public List<AlertResponse> history(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(AlertResponse::from).toList();
    }

    /** Push a new GPS position (REST version; the WebSocket stream comes in the next phase). */
    @Transactional
    public void updateLocation(Long userId, Long alertId, double lat, double lng) {
        Alert alert = findOwnAlert(userId, alertId);
        if (alert.getState() == AlertState.RESOLVED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This alert is already closed");
        }
        alert.setLatitude(lat);
        alert.setLongitude(lng);
        alert.setLocationUpdatedAt(LocalDateTime.now());
        alertRepository.save(alert);
    }

    // ---------------------------------------------------------------
    // REQ-SOS-08 and REQ-AUTH-05
    //  normal PIN -> really resolves the alert
    //  duress PIN -> looks resolved in the app, but stays active and becomes high priority
    // The controller returns the SAME reply for both, so nobody watching can tell.
    // ---------------------------------------------------------------
    @Transactional
    public void resolve(Long userId, Long alertId, String pin) {
        User user = findUser(userId);
        Alert alert = findOwnAlert(userId, alertId);

        if (alert.getState() == AlertState.RESOLVED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This alert is already closed");
        }

        if (passwordEncoder.matches(pin, user.getNormalPinHash())) {
            alert.setState(AlertState.RESOLVED);
            alert.setResolvedAt(LocalDateTime.now());
            alertRepository.save(alert);
            if (alert.getNotifiedAt() != null) {
                notifyContacts(userId, user.getName() + " confirmed they are safe. The alert has ended.");
            }
            return;
        }

        if (passwordEncoder.matches(pin, user.getDuressPinHash())) {
            boolean firstTime = !alert.isHighPriority();
            alert.setHighPriority(true);
            alert.setFakeResolved(true);
            alertRepository.save(alert);
            if (firstTime) {
                notifyContacts(userId, "URGENT: " + user.getName() + " entered a duress PIN. "
                        + "They may be in danger and unable to speak freely. Keep tracking: "
                        + trackingLink(alert) + " If you cannot reach them, call 112.");
            }
            return;
        }

        throw new ApiException(HttpStatus.BAD_REQUEST, "Incorrect PIN");
    }

    // ---------------------------------------------------------------
    // Trusted contact side (no login, uses the token from the SMS)
    // ---------------------------------------------------------------
    @Transactional(readOnly = true)
    public TrackingResponse getTracking(String token) {
        Alert alert = findLiveAlertByToken(token);
        return new TrackingResponse(alert.getUser().getName(), alert.getState().name(),
                alert.isHighPriority(), alert.getLatitude(), alert.getLongitude(),
                alert.getLocationUpdatedAt(), alert.getCreatedAt());
    }

    /** REQ-SOS-07: a contact acknowledges the alert. */
    @Transactional
    public void acknowledge(String token) {
        Alert alert = findLiveAlertByToken(token);
        if (alert.getState() == AlertState.TRIGGERED || alert.getState() == AlertState.NOTIFIED) {
            alert.setState(AlertState.ACKNOWLEDGED);
            alert.setAcknowledgedAt(LocalDateTime.now());
            alertRepository.save(alert);
        }
    }

    // ---------- helpers ----------

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Alert findOwnAlert(Long userId, Long alertId) {
        return alertRepository.findByIdAndUserId(alertId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Alert not found"));
    }

    private Alert findLiveAlertByToken(String token) {
        Alert alert = alertRepository.findByTrackingToken(token)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invalid link"));
        if (alert.getState() == AlertState.RESOLVED) {
            throw new ApiException(HttpStatus.GONE, "This alert has ended");
        }
        if (alert.getTrackingExpiresAt() != null && alert.getTrackingExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.GONE, "This link has expired");
        }
        return alert;
    }

    private String newToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String trackingLink(Alert alert) {
        return frontendUrl + "/track/" + alert.getTrackingToken();
    }

    private String buildAlertMessage(User user, Alert alert) {
        StringBuilder sb = new StringBuilder();
        sb.append("EMERGENCY: ").append(user.getName())
          .append(" triggered an SOS alert and may need help. Track live location: ")
          .append(trackingLink(alert));
        if (alert.getLatitude() != null && alert.getLongitude() != null) {
            sb.append(" Last known position: https://maps.google.com/?q=")
              .append(alert.getLatitude()).append(',').append(alert.getLongitude());
        }
        sb.append(" If they are in danger, call 112.");
        return sb.toString();
    }

    private void notifyContacts(Long userId, String message) {
        for (Contact c : contactService.getConfirmedContacts(userId)) {
            safeSend(c.getPhone(), message);
        }
    }

    // One failing SMS must never stop the others (notification redundancy)
    private boolean safeSend(String phone, String message) {
        try {
            smsService.send(phone, message);
            return true;
        } catch (Exception e) {
            log.warn("SMS could not be sent to a trusted contact: {}", e.getMessage());
            return false;
        }
    }
}
