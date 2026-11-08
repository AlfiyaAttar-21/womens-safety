package com.WomensSafety.womens_safety.service;

import org.springframework.stereotype.Service;

/**
 * Development stub: prints the SMS to the console.
 * Replace with a Twilio/MSG91 implementation of SmsService later.
 */
@Service
public class ConsoleSmsService implements com.WomensSafety.womens_safety.service.SmsService {
    @Override
    public void send(String phoneNumber, String message) {
        System.out.println("[SMS to " + phoneNumber + "] " + message);
    }
}
