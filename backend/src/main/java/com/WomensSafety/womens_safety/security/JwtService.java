
package com.WomensSafety.womens_safety.security;

import com.WomensSafety.womens_safety.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessMillis;
    private final long refreshMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-minutes}") long accessMinutes,
            @Value("${app.jwt.refresh-days}") long refreshDays) {

        if (secret == null ||
                secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 bytes");
        }

        if (accessMinutes <= 0 || refreshDays <= 0) {
            throw new IllegalArgumentException(
                    "JWT expiration values must be greater than zero");
        }

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8));

        this.accessMillis = Math.multiplyExact(accessMinutes, 60_000L);
        this.refreshMillis = Math.multiplyExact(refreshDays, 86_400_000L);
    }

    // Generate access token
    public String generateAccessToken(User user) {
        return buildToken(user, "access", accessMillis);
    }

    // Generate refresh token
    public String generateRefreshToken(User user) {
        return buildToken(user, "refresh", refreshMillis);
    }

    // Create JWT token
    private String buildToken(
            User user, String type, long expirationMillis) {

        Date now = new Date();

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("role", user.getRole().name())
                .claim("type", type)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMillis))
                .signWith(key)
                .compact();
    }

    // Validate and read token
    public Claims parse(String token) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("JWT token is empty");
        }

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Validate refresh token type
    public Claims parseRefreshToken(String token) {

        Claims claims = parse(token);

        if (!"refresh".equals(
                claims.get("type", String.class))) {
            throw new JwtException("Invalid refresh token");
        }

        return claims;
    }
}
