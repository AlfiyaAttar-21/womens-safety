package com.WomensSafety.womens_safety.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmailService {

    private final RestClient client = RestClient.create();

    @Value("${BREVO_API_KEY:}")
    private String apiKey;

    @Value("${MAIL_FROM:}")
    private String from;

    public void send(String toEmail, String subject, String message) {

        // Local development: no Brevo settings, so print instead
        if (apiKey.isBlank() || from.isBlank()) {
            System.out.println("DEV EMAIL to " + toEmail + ": " + message);
            return;
        }

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "SafeHer", "email", from),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "textContent", message
        );

        client.post()
                .uri("https://api.brevo.com/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}