package com.WomensSafety.womens_safety.dto;

import com.WomensSafety.womens_safety.entity.Alert;
import java.time.LocalDateTime;

/**
 * What the USER's app sees. It never shows highPriority, and after the duress PIN
 * it shows the alert as RESOLVED, so someone watching the screen is not alerted.
 */
public record AlertResponse(Long id, String state, Double latitude, Double longitude,
                            LocalDateTime createdAt, Integer contactsNotified) {

    public static AlertResponse from(Alert a, Integer contactsNotified) {
        String shownState = a.isFakeResolved() ? "RESOLVED" : a.getState().name();
        return new AlertResponse(a.getId(), shownState, a.getLatitude(), a.getLongitude(),
                a.getCreatedAt(), contactsNotified);
    }

    public static AlertResponse from(Alert a) {
        return from(a, null);
    }
}
