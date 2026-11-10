
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.dto.*;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.SosService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sos")
@CrossOrigin(origins = "*")
public class SosController {

    private final SosService sosService;

    public SosController(SosService sosService) {
        this.sosService = sosService;
    }

    private Long getUserId(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return user.getId();
    }

    // Verify Normal PIN before showing SOS buttons
    @PostMapping("/verify-pin")
    public Map<String, String> verifyPin(
            Authentication auth,
            @Valid @RequestBody ResolveRequest req) {

        sosService.verifyNormalPin(
                getUserId(auth),
                req.getPin()
        );

        return Map.of(
                "message",
                "Normal PIN verified successfully",
                "status",
                "VERIFIED"
        );
    }

    @PostMapping("/trigger")
    public ResponseEntity<AlertResponse> trigger(
            Authentication auth,
            @Valid @RequestBody(required = false) SosTriggerRequest req) {

        Long userId = getUserId(auth);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sosService.trigger(userId, req));
    }

    @GetMapping("/active")
    public ResponseEntity<AlertResponse> active(Authentication auth) {

        return sosService.getActive(getUserId(auth))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/history")
    public List<AlertResponse> history(Authentication auth) {
        return sosService.history(getUserId(auth));
    }

    @PutMapping("/{id}/location")
    public Map<String, String> location(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody LocationRequest req) {

        sosService.updateLocation(
                getUserId(auth),
                id,
                req.getLatitude(),
                req.getLongitude()
        );

        return Map.of("message", "Location updated");
    }

    @PostMapping("/{id}/resolve")
    public Map<String, String> resolve(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody ResolveRequest req) {

        sosService.resolve(
                getUserId(auth),
                id,
                req.getPin()
        );

        return Map.of(
                "message", "Alert resolved",
                "status", "RESOLVED"
        );
    }

    @GetMapping("/track/{token}")
    public TrackingResponse track(@PathVariable String token) {
        return sosService.getTracking(token);
    }

    @PostMapping("/track/{token}/acknowledge")
    public Map<String, String> acknowledge(@PathVariable String token) {

        sosService.acknowledge(token);

        return Map.of(
                "message",
                "Thank you. Your acknowledgement was recorded"
        );
    }
}
