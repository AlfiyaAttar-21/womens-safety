package com.WomensSafety.womens_safety.dto;

import java.time.LocalDateTime;

/** What a trusted CONTACT sees through the tracking link (real state, real priority). */
public record TrackingResponse(String userName, String state, boolean highPriority,
                               Double latitude, Double longitude,
                               LocalDateTime locationUpdatedAt, LocalDateTime triggeredAt) {
}
