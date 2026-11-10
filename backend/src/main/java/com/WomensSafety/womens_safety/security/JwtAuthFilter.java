
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

    // Skip JWT authentication for public Risk Map APIs
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.equals("/api/grid-cells")
                || path.startsWith("/api/grid-cells/");
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

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("JWT ERROR: Authorization header missing");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            Claims claims = jwtService.parse(token);

            String tokenType = claims.get("type", String.class);

            System.out.println("JWT SIGNATURE: VALID");
            System.out.println("TOKEN TYPE: " + tokenType);
            System.out.println("TOKEN SUBJECT: " + claims.getSubject());

            if (!"access".equals(tokenType)) {

                System.out.println("JWT ERROR: Access token required");

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Access token required");

                return;
            }

            Long userId = Long.valueOf(claims.getSubject());

            User user = userRepository.findById(userId).orElse(null);

            if (user == null) {

                System.out.println("JWT ERROR: User not found");

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "User not found");

                return;
            }

            if (!user.isActive()) {

                System.out.println("JWT ERROR: User is inactive");

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "User inactive");

                return;
            }

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
