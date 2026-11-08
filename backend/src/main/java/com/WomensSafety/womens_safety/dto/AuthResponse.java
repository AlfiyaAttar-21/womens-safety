package com.WomensSafety.womens_safety.dto;

public record AuthResponse(String accessToken, String refreshToken, Long userId, String name) {}
