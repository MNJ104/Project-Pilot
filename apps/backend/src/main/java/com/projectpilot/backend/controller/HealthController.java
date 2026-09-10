package com.projectpilot.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/actuator/health")
@RequiredArgsConstructor
@Tag(name = "Health", description = "System health check endpoint")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    @Operation(summary = "System health check", description = "Verifies backend status and database connectivity")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "project-pilot-backend");
        response.put("timestamp", ZonedDateTime.now().toString());

        Map<String, Object> details = new HashMap<>();
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            details.put("database", "UP");
        } catch (Exception e) {
            details.put("database", "DOWN (" + e.getMessage() + ")");
            response.put("status", "DOWN");
        }

        response.put("details", details);
        return ResponseEntity.ok(response);
    }
}
