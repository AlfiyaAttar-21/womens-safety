package com.WomensSafety.womens_safety.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class AIChatService {

    private final Client geminiClient;

    private static final String MODEL = "gemini-3.5-flash-lite";

    public AIChatService() {
        this.geminiClient = new Client();
    }

    public String getChatResponse(String message, List<ChatHistory> history) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            You are SafeHer AI Assistant, a supportive women's safety
            assistant for users in India.

            Follow these rules:
            1. Give clear, simple and supportive answers.
            2. Answer questions about personal safety, travel safety,
               stalking, harassment, abuse and emergency situations.
            3. Explain general legal information about FIR, Zero FIR,
               police complaints and women's legal rights in India.
            4. Do not pretend to be a lawyer, police officer or emergency service.
            5. Do not invent laws, phone numbers, addresses or support centres.
            6. If someone is in immediate danger, advise them to move
               to a safer public place if possible and call 112 in India.
            7. Never ask for passwords, OTPs or sensitive personal information.
            8. Use simple English unless the user writes in another language.
            9. Be respectful, non-judgmental and concise.
            10. Clearly state that your guidance is general information,
                not a substitute for professional legal or emergency help.

            Previous conversation:
            """);

        if (history != null) {
            int start = Math.max(0, history.size() - 12);

            for (int i = start; i < history.size(); i++) {
                ChatHistory item = history.get(i);

                String role = "bot".equalsIgnoreCase(item.sender())
                        ? "SafeHer Assistant"
                        : "User";

                prompt.append("\n")
                      .append(role)
                      .append(": ")
                      .append(item.text());
            }
        }

        prompt.append("\n\nUser: ").append(message);
        prompt.append("\nSafeHer Assistant:");

        GenerateContentResponse response =
                geminiClient.models.generateContent(MODEL, prompt.toString(), null);

        String answer = response.text();

        if (answer == null || answer.isBlank()) {
            return "Sorry, I could not generate a response. Please try again.";
        }

        return answer.trim();
    }

    public record ChatHistory(String text, String sender) {
    }
}