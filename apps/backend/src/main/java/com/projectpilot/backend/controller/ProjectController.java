package com.projectpilot.backend.controller;

import com.projectpilot.backend.dto.ProjectDto;
import com.projectpilot.backend.security.UserPrincipal;
import com.projectpilot.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project workspace management endpoints")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "List user projects", description = "Fetches active projects belonging to current user")
    public ResponseEntity<List<ProjectDto>> getProjects(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ProjectDto> projects = projectService.getProjectsForUser(currentUser.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details", description = "Fetches metadata for a specific project workspace")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable("id") UUID id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    @Operation(summary = "Create project", description = "Creates a new software planning workspace")
    public ResponseEntity<ProjectDto> createProject(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "New Project Workspace");
        String description = body.getOrDefault("description", "");
        ProjectDto project = projectService.createProject(currentUser.getId(), title, description);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project details", description = "Updates title or description of a project workspace")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, String> body) {
        String title = body.get("title");
        String description = body.get("description");
        ProjectDto updated = projectService.updateProject(id, title, description);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Soft deletes a project workspace")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
