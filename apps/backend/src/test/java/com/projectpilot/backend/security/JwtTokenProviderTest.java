package com.projectpilot.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "super_secret_jwt_key_at_least_64_characters_long_for_security_123456789";

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", secret);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000L); // 1 hour
    }

    @Test
    void generateAndValidateToken_Success() {
        UUID userId = UUID.randomUUID();
        String email = "test@example.com";

        String token = tokenProvider.generateTokenFromUserId(userId, email);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(userId, tokenProvider.getUserIdFromJWT(token));
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        assertFalse(tokenProvider.validateToken("invalid.jwt.token"));
    }
}
