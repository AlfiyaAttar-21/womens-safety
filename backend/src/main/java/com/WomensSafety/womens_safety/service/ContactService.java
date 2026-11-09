package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.dto.ContactRequest;
import com.WomensSafety.womens_safety.dto.ContactResponse;
import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.Contact.ConsentStatus;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.exception.ApiException;
import com.WomensSafety.womens_safety.repository.ContactRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class ContactService {

    private static final int MAX_CONTACTS = 5;          // REQ-AUTH-03
    private static final int CONSENT_VALID_DAYS = 7;

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final SmsService smsService;
    private final String frontendUrl;
    private final SecureRandom random = new SecureRandom();

    public ContactService(ContactRepository contactRepository, UserRepository userRepository,
                          SmsService smsService,
                          @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.smsService = smsService;
        this.frontendUrl = frontendUrl;
    }

    /** REQ-AUTH-03 and REQ-AUTH-04 */
    @Transactional
    public ContactResponse addContact(Long userId, ContactRequest req) {
        User user = findUser(userId);

        if (req.getPhone().equals(user.getPhoneNumber())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot add your own number");
        }
        long current = contactRepository.countByUserIdAndConsentStatusNot(userId, ConsentStatus.OPTED_OUT);
        if (current >= MAX_CONTACTS) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You can add up to " + MAX_CONTACTS + " trusted contacts");
        }
        if (contactRepository.existsByUserIdAndPhone(userId, req.getPhone())) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "This number is already in your contacts (delete it first to add it again)");
        }

        Contact c = new Contact();
        c.setUser(user);
        c.setName(req.getName().trim());
        c.setPhone(req.getPhone());
        c.setEmail(req.getEmail());
        c.setRelationship(req.getRelationship());
        c.setConsentStatus(ConsentStatus.PENDING);
        c.setStatus(ConsentStatus.PENDING.name());
        newConsentRequest(c);
        contactRepository.save(c);

        sendConsentSms(user, c);
        return ContactResponse.from(c);
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> listContacts(Long userId) {
        return contactRepository.findByUserId(userId).stream().map(ContactResponse::from).toList();
    }
    
    @Transactional
    public ContactResponse updateContact(Long userId, Long contactId, ContactRequest req) {

        User user = findUser(userId);

        Contact c = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND, "Contact not found"));

        if (req.getPhone().equals(user.getPhoneNumber())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot add your own number");
        }

        boolean phoneChanged = !c.getPhone().equals(req.getPhone());

        if (phoneChanged &&
                contactRepository.existsByUserIdAndPhone(userId, req.getPhone())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This number is already in your contacts");
        }

        c.setName(req.getName().trim());
        c.setPhone(req.getPhone());
        c.setEmail(req.getEmail());
        c.setRelationship(req.getRelationship());

        if (phoneChanged) {
            c.setConsentStatus(ConsentStatus.PENDING);
            c.setStatus(ConsentStatus.PENDING.name());
            newConsentRequest(c);
        }

        contactRepository.save(c);

        if (phoneChanged) {
            sendConsentSms(user, c);
        }

        return ContactResponse.from(c);
    }

    @Transactional
    public void removeContact(Long userId, Long contactId) {
        Contact c = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Contact not found"));
        contactRepository.delete(c);
    }

    @Transactional
    public void resendConsent(Long userId, Long contactId) {
        User user = findUser(userId);
        Contact c = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Contact not found"));
        if (c.getConsentStatus() != ConsentStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This contact has already answered");
        }
        newConsentRequest(c);
        contactRepository.save(c);
        sendConsentSms(user, c);
    }

    /** Called by the contact through the consent link (no login needed). */
    @Transactional
    public void accept(String token) {
        Contact c = findByToken(token);
        if (c.getConsentStatus() == ConsentStatus.OPTED_OUT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You opted out. Ask to be added again");
        }
        if (c.getConsentStatus() == ConsentStatus.PENDING
                && c.getConsentRequestedAt().plusDays(CONSENT_VALID_DAYS).isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.GONE, "This link has expired. Ask to receive a new one");
        }
        c.setConsentStatus(ConsentStatus.ACCEPTED);
        c.setStatus(ConsentStatus.ACCEPTED.name());
        contactRepository.save(c);
    }

    /** A contact can opt out at any time. */
    @Transactional
    public void optOut(String token) {
        Contact c = findByToken(token);
        c.setConsentStatus(ConsentStatus.OPTED_OUT);
        c.setStatus(ConsentStatus.OPTED_OUT.name());
        contactRepository.save(c);
    }

    /** Used later by the SOS flow: only contacts who accepted get alerts. */
    @Transactional(readOnly = true)
    public List<Contact> getConfirmedContacts(Long userId) {
        return contactRepository.findByUserIdAndConsentStatus(userId, ConsentStatus.ACCEPTED);
    }

    // ---------- helpers ----------

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Contact findByToken(String token) {
        return contactRepository.findByConsentToken(token)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invalid link"));
    }

    private void newConsentRequest(Contact c) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        c.setConsentToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
        c.setConsentRequestedAt(LocalDateTime.now());
    }

    private void sendConsentSms(User user, Contact c) {
        String link = frontendUrl + "/consent/" + c.getConsentToken();
        smsService.send(c.getPhone(), user.getName() + " added you as a trusted contact on "
                + "Women's Safety Companion. You will get alerts only if you accept. "
                + "Accept or decline here: " + link);
    }
}
