package com.projectpilot.backend.controller;

import com.projectpilot.backend.dto.AuthResponse;
import com.projectpilot.backend.dto.LoginRequest;
import com.projectpilot.backend.dto.RegisterRequest;
import com.projectpilot.backend.dto.UserDto;
import com.projectpilot.backend.security.UserPrincipal;
import com.projectpilot.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration, login, and profile APIs")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns JWT credentials")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = userService.registerUser(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Validates user credentials and returns JWT bearer token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = userService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Returns user metadata for active JWT session")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto userDto = userService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(userDto);
    }
}
