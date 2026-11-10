
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.dto.LocationRequest;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.LiveTrackingService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
public class LiveTrackingController {

    private final LiveTrackingService trackingService;

    public LiveTrackingController(LiveTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    private Long getUserId(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> start(
            Authentication authentication) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                trackingService.startTracking(userId));
    }

    @PostMapping("/location")
    public ResponseEntity<Map<String, String>> updateLocation(
            Authentication authentication,
            @Valid @RequestBody LocationRequest request) {

        Long userId = getUserId(authentication);

        trackingService.updateLocation(userId, request);

        return ResponseEntity.ok(
                Map.of("message", "Location updated"));
    }

    @GetMapping("/public/{token}")
    public ResponseEntity<Map<String, Object>> publicLocation(
            @PathVariable String token) {

        return ResponseEntity.ok(
                trackingService.getPublicLocation(token));
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stop(
            Authentication authentication) {

        Long userId = getUserId(authentication);

        trackingService.stopTracking(userId);

        return ResponseEntity.ok(
                Map.of("message", "Tracking stopped"));
    }
}
