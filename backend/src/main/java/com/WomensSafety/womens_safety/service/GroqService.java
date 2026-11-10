
package com.WomensSafety.womens_safety.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestClient restClient;

    public GroqService() {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String askQuestion(String question) {

        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.3-70b-versatile",

            "messages", List.of(

                Map.of(
                    "role", "system",
                    "content",
                    """
                    You are a Women's Safety Assistant.

                    Provide supportive, respectful and practical
                    safety guidance.

                    Help users understand general safety precautions,
                    women's rights and emergency resources in India.

                    For immediate danger:
                    - Advise contacting emergency services at 112.
                    - Suggest moving to a safer place if possible.
                    - Encourage contacting a trusted person.

                    Never claim to be a lawyer or emergency service.

                    Explain that legal information is general and
                    not a substitute for professional legal advice.

                    Do not invent helpline numbers or legal provisions.
                    """
                ),

                Map.of(
                    "role", "user",
                    "content", question
                )
            )
        );

        Map<?, ?> response = restClient.post()
                .uri("/chat/completions")
                .header(
                    HttpHeaders.AUTHORIZATION,
                    "Bearer " + apiKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new RuntimeException(
                "Empty response from Groq"
            );
        }

        List<?> choices =
                (List<?>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException(
                "No answer received from Groq"
            );
        }

        Map<?, ?> firstChoice =
                (Map<?, ?>) choices.get(0);

        Map<?, ?> message =
                (Map<?, ?>) firstChoice.get("message");

        if (message == null || message.get("content") == null) {
            throw new RuntimeException(
                "Invalid response from Groq"
            );
        }

        return message.get("content").toString();
    }
}
