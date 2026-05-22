package com.demo.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    /**
     * Public endpoint — no token required.
     */
    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    /**
     * Requires a valid JWT (any authenticated user).
     * Returns basic claims from the token so the browser can inspect them.
     */
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> result = new HashMap<>();
        result.put("subject",  jwt.getSubject());
        result.put("username", jwt.getClaimAsString("preferred_username"));
        result.put("email",    jwt.getClaimAsString("email"));
        result.put("roles",    jwt.getClaimAsMap("realm_access"));
        return result;
    }

    /**
     * Requires the 'client' realm role.
     * alice can call this; bob cannot (403).
     */
    @GetMapping("/protected/data")
    @PreAuthorize("hasRole('client')")
    public Map<String, Object> protectedData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> result = new HashMap<>();
        result.put("message",  "You have the 'client' role — access granted");
        result.put("user",     jwt.getClaimAsString("preferred_username"));
        result.put("issuedAt", jwt.getIssuedAt() != null ? jwt.getIssuedAt().toString() : null);
        return result;
    }

    /**
     * Authenticated but no role restriction — both alice and bob can reach this.
     * Useful for showing that authentication != authorization.
     */
    @GetMapping("/user/profile")
    public Map<String, Object> profile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> result = new HashMap<>();
        result.put("username",  jwt.getClaimAsString("preferred_username"));
        result.put("firstName", jwt.getClaimAsString("given_name"));
        result.put("lastName",  jwt.getClaimAsString("family_name"));
        result.put("email",     jwt.getClaimAsString("email"));
        return result;
    }
}
