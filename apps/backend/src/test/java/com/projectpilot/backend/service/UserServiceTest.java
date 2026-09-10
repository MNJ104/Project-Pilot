package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.AuthResponse;
import com.projectpilot.backend.dto.RegisterRequest;
import com.projectpilot.backend.entity.Role;
import com.projectpilot.backend.entity.RoleName;
import com.projectpilot.backend.entity.User;
import com.projectpilot.backend.exception.BadRequestException;
import com.projectpilot.backend.repository.RoleRepository;
import com.projectpilot.backend.repository.UserRepository;
import com.projectpilot.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private UserService userService;

    private Role defaultRole;

    @BeforeEach
    void setUp() {
        defaultRole = Role.builder().id(UUID.randomUUID()).name(RoleName.DEVELOPER).build();
    }

    @Test
    void registerUser_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("password123")
                .fullName("New User")
                .role("DEVELOPER")
                .build();

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.DEVELOPER)).thenReturn(Optional.of(defaultRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        
        UUID savedId = UUID.randomUUID();
        User savedUser = User.builder()
                .id(savedId)
                .email("newuser@example.com")
                .passwordHash("encodedPassword")
                .fullName("New User")
                .roles(java.util.Collections.singleton(defaultRole))
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateTokenFromUserId(savedId, "newuser@example.com")).thenReturn("mockJwtToken");
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);

        AuthResponse response = userService.registerUser(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("newuser@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .email("existing@example.com")
                .password("password123")
                .fullName("Existing User")
                .build();

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.registerUser(request));
        verify(userRepository, never()).save(any(User.class));
    }
}
