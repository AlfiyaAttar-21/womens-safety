package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Use BCrypt for password and PIN hashing[cite: 7]
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 1. Register a new user
    public User registerUser(User user, String rawPassword, String rawNormalPin, String rawDuressPin) {
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setNormalPinHash(passwordEncoder.encode(rawNormalPin));
        user.setDuressPinHash(passwordEncoder.encode(rawDuressPin));
        return userRepository.save(user);
    }

    // 2. Find user by phone number for login[cite: 4]
    public Optional<User> findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    // 3. Verify normal or duress PIN[cite: 4]
    public boolean verifyPin(String rawPin, String encodedPin) {
        return passwordEncoder.matches(rawPin, encodedPin);
    }
}