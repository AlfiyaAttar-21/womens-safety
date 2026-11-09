
package com.WomensSafety.womens_safety.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            try {
                String token = header.substring(7);

                Claims claims = jwtService.parse(token);

                // Only access tokens are accepted
                String tokenType = claims.get("type", String.class);

                if (!"access".equals(tokenType)) {
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid token type"
                    );
                    return;
                }

                Long userId = Long.valueOf(claims.getSubject());

                String role = claims.get("role", String.class);

                if (role == null || userId <= 0) {
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid token"
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                    );

                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            } catch (JwtException | IllegalArgumentException e) {

                SecurityContextHolder.clearContext();

                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired token"
                );
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
