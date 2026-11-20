package com.WomensSafety.womens_safety.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TextBeeService {

    private final RestClient restClient;
    private final String apiKey;
    private final String deviceId;

    public TextBeeService(
            @Value("${textbee.api.url}") String apiUrl,
            @Value("${textbee.api.key}") String apiKey,
            @Value("${textbee.device.id}") String deviceId) {

        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();

        this.apiKey = apiKey;
        this.deviceId = deviceId;
    }

    public void sendSms(String phoneNumber, String message) {

        // Add India's country code if the number has 10 digits
        if (phoneNumber.length() == 10) {
            phoneNumber = "+91" + phoneNumber;
        }

        Map<String, Object> request = Map.of(
                "recipients", List.of(phoneNumber),
                "message", message,
                "deviceId", deviceId
        );

        restClient.post()
                .uri("/gateway/send-sms")
                .header("x-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }
}