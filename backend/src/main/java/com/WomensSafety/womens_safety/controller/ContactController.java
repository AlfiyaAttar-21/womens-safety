
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.dto.ContactRequest;
import com.WomensSafety.womens_safety.dto.ContactResponse;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.ContactService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // Get logged-in user's ID
    private Long getUserId(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return user.getId();
    }

    // Add trusted contact
    @PostMapping
    public ResponseEntity<ContactResponse> add(
            Authentication auth,
            @Valid @RequestBody ContactRequest req) {

        Long userId = getUserId(auth);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contactService.addContact(userId, req));
    }

    // Get all trusted contacts
    @GetMapping
    public List<ContactResponse> list(Authentication auth) {
        Long userId = getUserId(auth);

        return contactService.listContacts(userId);
    }

    // Update trusted contact
    @PutMapping("/{id}")
    public ContactResponse update(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest req) {

        Long userId = getUserId(auth);

        return contactService.updateContact(userId, id, req);
    }

    // Delete trusted contact
    @DeleteMapping("/{id}")
    public Map<String, String> remove(
            Authentication auth,
            @PathVariable Long id) {

        Long userId = getUserId(auth);

        contactService.removeContact(userId, id);

        return Map.of("message", "Contact removed");
    }

    // Resend consent request
    @PostMapping("/{id}/resend-consent")
    public Map<String, String> resend(
            Authentication auth,
            @PathVariable Long id) {

        Long userId = getUserId(auth);

        contactService.resendConsent(userId, id);

        return Map.of("message", "Consent message sent again");
    }

    // Trusted contact accepts consent
    @PostMapping("/consent/{token}/accept")
    public Map<String, String> accept(@PathVariable String token) {

        contactService.accept(token);

        return Map.of("message", "Thank you. You will now receive alerts");
    }

    // Trusted contact declines consent
    @PostMapping("/consent/{token}/opt-out")
    public Map<String, String> optOut(@PathVariable String token) {

        contactService.optOut(token);

        return Map.of("message", "You will no longer receive alerts");
    }
}
