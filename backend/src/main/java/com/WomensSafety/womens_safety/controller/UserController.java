package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your React frontend to connect easily
public class UserController {

    @Autowired
    private UserService userService;

    // Helper DTO for incoming registration requests
    public static class RegisterRequest {
        public String name;
        public String phoneNumber;
        public String password;
        public String normalPin;
        public String duressPin;
    }

    // 1. User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User newUser = new User();
            newUser.setName(request.name);
            newUser.setPhoneNumber(request.phoneNumber);

            User savedUser = userService.registerUser(
                newUser, 
                request.password, 
                request.normalPin, 
                request.duressPin
            );
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }

    // 2. Find User by Phone Number Endpoint
    @GetMapping("/{phoneNumber}")
    public ResponseEntity<?> getUserByPhone(@PathVariable String phoneNumber) {
        Optional<User> user = userService.findByPhoneNumber(phoneNumber);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}