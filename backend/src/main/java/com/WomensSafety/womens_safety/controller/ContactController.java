package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.dto.ContactRequest;
import com.WomensSafety.womens_safety.dto.ContactResponse;
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

    // ----- logged-in user -----

    @PostMapping
    public ResponseEntity<ContactResponse> add(Authentication auth, @Valid @RequestBody ContactRequest req) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(userId, req));
    }

    @GetMapping
    public List<ContactResponse> list(Authentication auth) {
        return contactService.listContacts((Long) auth.getPrincipal());
    }
    
    @PutMapping("/{id}")
    public ContactResponse update(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest req) {

        Long userId = (Long) auth.getPrincipal();
        return contactService.updateContact(userId, id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> remove(Authentication auth, @PathVariable Long id) {
        contactService.removeContact((Long) auth.getPrincipal(), id);
        return Map.of("message", "Contact removed");
    }

    @PostMapping("/{id}/resend-consent")
    public Map<String, String> resend(Authentication auth, @PathVariable Long id) {
        contactService.resendConsent((Long) auth.getPrincipal(), id);
        return Map.of("message", "Consent message sent again");
    }

    // ----- the trusted contact (no login, uses the token from the SMS) -----

    @PostMapping("/consent/{token}/accept")
    public Map<String, String> accept(@PathVariable String token) {
        contactService.accept(token);
        return Map.of("message", "Thank you. You will now receive alerts");
    }

    @PostMapping("/consent/{token}/opt-out")
    public Map<String, String> optOut(@PathVariable String token) {
        contactService.optOut(token);
        return Map.of("message", "You will no longer receive alerts");
    }
}
