
package com.WomensSafety.womens_safety.security;

import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.UserRepository;

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
    private final UserRepository userRepository;

    public JwtAuthFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    // Skip JWT authentication for public APIs
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        // Public home page
        if (path.equals("/")) {
            return true;
        }

        // Public authentication APIs
        if (path.equals("/api/users/register")
                || path.equals("/api/users/verify-otp")
                || path.equals("/api/users/resend-otp")
                || path.equals("/api/users/login")
                || path.equals("/api/users/refresh")
                || path.equals("/api/users/forgot-password")
                || path.equals("/api/users/reset-password")) {
            return true;
        }

        // Public consent APIs
        if (path.startsWith("/api/contacts/consent/")) {
            return true;
        }

        // Public tracking APIs
        if (path.equals("/api/grid-cells")
                || path.startsWith("/api/grid-cells/")
                || path.startsWith("/api/tracking/public/")
                || path.startsWith("/api/sos/track/")
                || path.startsWith("/api/journeys/track/")) {
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("\n========== JWT FILTER START ==========");
        System.out.println("REQUEST URL: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        // No token: continue to Spring Security
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            Claims claims = jwtService.parse(token);

            String tokenType = claims.get("type", String.class);

            // Only access tokens are accepted
            if (!"access".equals(tokenType)) {

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Access token required");

                return;
            }

            Long userId = Long.valueOf(claims.getSubject());

            User user = userRepository.findById(userId).orElse(null);

            // Check user existence and account status
            if (user == null || !user.isActive()) {

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "User not found or inactive");

                return;
            }

            // Set authentication in security context
            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(user.getRole().name());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(authority));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

            System.out.println("JWT SIGNATURE: VALID");
            System.out.println("JWT AUTHENTICATION SUCCESS");
            System.out.println("USER ID: " + user.getId());
            System.out.println("USER ROLE: " + user.getRole());

        } catch (JwtException | IllegalArgumentException exception) {

            System.out.println("JWT VALIDATION FAILED");
            System.out.println("ERROR TYPE: "
                    + exception.getClass().getSimpleName());
            System.out.println("ERROR MESSAGE: "
                    + exception.getMessage());

            SecurityContextHolder.clearContext();

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT token");

            return;
        }

        System.out.println("========== JWT FILTER END ==========\n");

        filterChain.doFilter(request, response);
    }
}
