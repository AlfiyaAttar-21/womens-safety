package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Contact;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.ContactRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    public Contact addContact(Long userId, Contact contact) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        contact.setUser(user);
        return contactRepository.save(contact);
    }

    public List<Contact> getContactsByUser(Long userId) {
        return contactRepository.findByUserId(userId);
    }
}
