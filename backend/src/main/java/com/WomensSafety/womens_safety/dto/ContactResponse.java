package com.WomensSafety.womens_safety.dto;

import com.WomensSafety.womens_safety.entity.Contact;

public record ContactResponse(Long id, String name, String phone, String email,
                              String relationship, String consentStatus) {

    public static ContactResponse from(Contact c) {
        return new ContactResponse(c.getId(), c.getName(), c.getPhone(), c.getEmail(),
                c.getRelationship(), c.getConsentStatus().name());
    }
}
