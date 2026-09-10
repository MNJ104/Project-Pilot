package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.AuthResponse;
import com.projectpilot.backend.dto.LoginRequest;
import com.projectpilot.backend.dto.RegisterRequest;
import com.projectpilot.backend.dto.UserDto;
import com.projectpilot.backend.entity.Role;
import com.projectpilot.backend.entity.RoleName;
import com.projectpilot.backend.entity.User;
import com.projectpilot.backend.exception.BadRequestException;
import com.projectpilot.backend.exception.ResourceNotFoundException;
import com.projectpilot.backend.repository.RoleRepository;
import com.projectpilot.backend.repository.UserRepository;
import com.projectpilot.backend.security.JwtTokenProvider;
import com.projectpilot.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + registerRequest.getEmail());
        }

        RoleName requestedRole = RoleName.DEVELOPER;
        if (registerRequest.getRole() != null && !registerRequest.getRole().isBlank()) {
            try {
                requestedRole = RoleName.valueOf(registerRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid role requested: {}, defaulting to DEVELOPER", registerRequest.getRole());
            }
        }

        Role userRole = roleRepository.findByName(requestedRole)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.DEVELOPER).build()));

        Set<Role> roles = new HashSet<>(Collections.singletonList(userRole));

        User user = User.builder()
                .email(registerRequest.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName().trim())
                .roles(roles)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail());
        UserDto userDto = mapUserToDto(savedUser);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getJwtExpirationMs())
                .user(userDto)
                .build();
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().trim().toLowerCase(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDto userDto = mapUserToDto(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getJwtExpirationMs())
                .user(userDto)
                .build();
    }

    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapUserToDto(user);
    }

    public UserDto mapUserToDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roleNames)
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
}
