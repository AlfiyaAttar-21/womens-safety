package com.WomensSafety.womens_safety.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.ContactRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    // Add a trusted contact for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addContact(@PathVariable Long userId, @Valid @RequestBody Contact contactDetails) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        contactDetails.setUser(userOpt.get());
        Contact savedContact = contactRepository.save(contactDetails);
        return ResponseEntity.ok(savedContact);
    }

    // Get all contacts for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Contact>> getContactsByUser(@PathVariable Long userId) {
        List<Contact> contacts = contactRepository.findByUserId(userId);
        return ResponseEntity.ok(contacts);
    }
}