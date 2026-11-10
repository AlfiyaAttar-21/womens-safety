
package com.WomensSafety.womens_safety.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WomensSafety.womens_safety.service.AIChatService;
import com.WomensSafety.womens_safety.service.AIChatService.ChatHistory;

@RestController
@RequestMapping("/api/chatbot")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {

        if (request.message() == null || request.message().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Please enter a message."));
        }

        if (request.message().length() > 3000) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse(
                            "Message is too long. Please keep it under 3000 characters."
                    ));
        }

        try {
            System.out.println("1. CHATBOT REQUEST RECEIVED");

            System.out.println("2. SENDING REQUEST TO GEMINI");

            String reply = aiChatService.getChatResponse(
                    request.message(),
                    request.history()
            );

            System.out.println("3. GEMINI RESPONSE RECEIVED");

            return ResponseEntity.ok(new ChatResponse(reply));

        } catch (Exception e) {

            System.err.println("GEMINI CHATBOT ERROR:");
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ChatResponse(
                            "Sorry, SafeHer AI is temporarily unavailable. Please try again later. If you are in immediate danger, call 112."
                    ));
        }
    }

    public record ChatRequest(
            String message,
            List<ChatHistory> history
    ) {
    }

    public record ChatResponse(String reply) {
    }
}
