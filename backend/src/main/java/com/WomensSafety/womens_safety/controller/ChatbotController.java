
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.service.GroqService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final GroqService groqService;

    public ChatbotController(GroqService groqService) {
        this.groqService = groqService;
    }

    public record ChatRequest(
        @NotBlank(message = "Question cannot be empty")
        String question
    ) {}

    public record ChatResponse(String answer) {}

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(
            @Valid @RequestBody ChatRequest request) {

        try {
            String answer = groqService.askQuestion(
                request.question()
            );

            return ResponseEntity.ok(
                new ChatResponse(answer)
            );

        } catch (Exception e) {
            System.err.println(
                "Groq API error: " + e.getMessage()
            );

            return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body("AI assistant is temporarily unavailable.");
        }
    }
}
