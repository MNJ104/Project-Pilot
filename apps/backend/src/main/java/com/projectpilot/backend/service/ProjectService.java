package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.ProjectDto;
import com.projectpilot.backend.entity.Project;
import com.projectpilot.backend.entity.User;
import com.projectpilot.backend.exception.ResourceNotFoundException;
import com.projectpilot.backend.repository.ProjectRepository;
import com.projectpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<ProjectDto> getProjectsForUser(UUID userId) {
        List<Project> projects = projectRepository.findByOwnerIdAndDeletedAtIsNull(userId);
        
        // If user has no active projects, create default workspace project for them
        if (projects.isEmpty()) {
            User owner = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

            Project defaultProject = Project.builder()
                    .title("Default Software Planning Space")
                    .description("Auto-generated primary workspace for AI software planning and architecture.")
                    .owner(owner)
                    .status("PLANNING")
                    .healthScore(100)
                    .build();

            Project saved = projectRepository.save(defaultProject);
            return List.of(mapToDto(saved));
        }

        return projects.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ProjectDto getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return mapToDto(project);
    }

    @Transactional
    public ProjectDto createProject(UUID ownerId, String title, String description) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + ownerId));

        Project project = Project.builder()
                .title(title)
                .description(description)
                .owner(owner)
                .status("PLANNING")
                .healthScore(100)
                .build();

        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(UUID projectId, String title, String description) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        if (title != null && !title.isBlank()) project.setTitle(title.trim());
        if (description != null) project.setDescription(description.trim());

        Project updated = projectRepository.save(project);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        project.setDeletedAt(ZonedDateTime.now());
        projectRepository.save(project);
    }

    public ProjectDto mapToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .status(project.getStatus())
                .healthScore(project.getHealthScore())
                .createdAt(project.getCreatedAt() != null ? project.getCreatedAt().toString() : null)
                .build();
    }
}
