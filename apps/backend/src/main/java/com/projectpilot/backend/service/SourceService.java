package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.IngestSourceDto;
import com.projectpilot.backend.dto.SourceDetailDto;
import com.projectpilot.backend.dto.SourceResponseDto;
import com.projectpilot.backend.entity.Project;
import com.projectpilot.backend.entity.Source;
import com.projectpilot.backend.entity.SourceDocument;
import com.projectpilot.backend.entity.User;
import com.projectpilot.backend.exception.ResourceNotFoundException;
import com.projectpilot.backend.repository.FeatureRepository;
import com.projectpilot.backend.repository.ProjectRepository;
import com.projectpilot.backend.repository.RequirementRepository;
import com.projectpilot.backend.repository.SourceDocumentRepository;
import com.projectpilot.backend.repository.SourceRepository;
import com.projectpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SourceService {

    private final SourceRepository sourceRepository;
    private final SourceDocumentRepository sourceDocumentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final RequirementRepository requirementRepository;
    private final FeatureRepository featureRepository;

    @Transactional
    public SourceResponseDto ingestSource(UUID userId, IngestSourceDto dto) {
        UUID projectId = dto.getProjectId();

        Project project;
        if (projectId == null) {
            project = projectRepository.findByOwnerIdAndDeletedAtIsNull(userId).stream()
                    .findFirst()
                    .orElseGet(() -> {
                        User owner = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                        return projectRepository.save(Project.builder()
                                .title("Default Software Planning Space")
                                .description("Auto-generated workspace")
                                .owner(owner)
                                .build());
                    });
        } else {
            project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        }

        User user = userRepository.findById(userId).orElse(null);
        String contentHash = computeHash(dto.getRawContent());

        Source source = Source.builder()
                .project(project)
                .sourceType(dto.getSourceType().toUpperCase())
                .url(dto.getUrl())
                .title(dto.getTitle())
                .contentHash(contentHash)
                .extractedBy(user)
                .build();

        Source savedSource = sourceRepository.save(source);

        SourceDocument doc = SourceDocument.builder()
                .source(savedSource)
                .rawContent(dto.getRawContent())
                .normalizedContent(dto.getNormalizedContent() != null ? dto.getNormalizedContent() : dto.getRawContent())
                .build();

        sourceDocumentRepository.save(doc);

        return mapToResponseDto(savedSource, dto.getRawContent());
    }

    public List<SourceResponseDto> getSourcesForProject(UUID projectId) {
        List<Source> sources = sourceRepository.findByProjectId(projectId);
        return sources.stream()
                .map(s -> {
                    SourceDocument doc = sourceDocumentRepository.findBySourceId(s.getId()).orElse(null);
                    String text = doc != null ? doc.getRawContent() : "";
                    return mapToResponseDto(s, text);
                })
                .collect(Collectors.toList());
    }

    public SourceDetailDto getSourceDetails(UUID sourceId) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found: " + sourceId));

        SourceDocument doc = sourceDocumentRepository.findBySourceId(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source document not found for source: " + sourceId));

        SourceDetailDto detail = new SourceDetailDto();
        detail.setId(source.getId());
        detail.setProjectId(source.getProject().getId());
        detail.setSourceType(source.getSourceType());
        detail.setUrl(source.getUrl());
        detail.setTitle(source.getTitle());
        detail.setContentHash(source.getContentHash());
        detail.setCreatedAt(source.getCreatedAt() != null ? source.getCreatedAt().toString() : null);
        detail.setSummaryPreview(doc.getRawContent().length() > 200 ? doc.getRawContent().substring(0, 200) + "..." : doc.getRawContent());
        detail.setDetectedDomain(source.getSourceType());
        int reqCount = requirementRepository.findByProjectId(source.getProject().getId()).size();
        int featCount = featureRepository.findByProjectId(source.getProject().getId()).size();
        String complexity = reqCount > 10 ? "HIGH" : (reqCount > 4 ? "MEDIUM" : "LOW");

        detail.setRequirementsCount(reqCount);
        detail.setFeaturesCount(featCount);
        detail.setComplexityScore(complexity);
        detail.setFeasibilityRating("HIGH");
        detail.setSuggestedNextStep("Generate Requirements & Architecture");
        detail.setRawContent(doc.getRawContent());
        detail.setNormalizedContent(doc.getNormalizedContent());
        return detail;
    }

    @Transactional
    public void deleteSource(UUID sourceId) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found: " + sourceId));
        sourceRepository.delete(source);
    }

    private SourceResponseDto mapToResponseDto(Source source, String rawText) {
        String summary = rawText != null && rawText.length() > 200
                ? rawText.substring(0, 200) + "..."
                : (rawText != null ? rawText : "");

        int reqCount = requirementRepository.findByProjectId(source.getProject().getId()).size();
        int featCount = featureRepository.findByProjectId(source.getProject().getId()).size();
        String complexity = reqCount > 10 ? "HIGH" : (reqCount > 4 ? "MEDIUM" : "LOW");

        return SourceResponseDto.builder()
                .id(source.getId())
                .projectId(source.getProject().getId())
                .sourceType(source.getSourceType())
                .url(source.getUrl())
                .title(source.getTitle())
                .contentHash(source.getContentHash())
                .createdAt(source.getCreatedAt() != null ? source.getCreatedAt().toString() : null)
                .summaryPreview(summary)
                .detectedDomain(source.getSourceType())
                .requirementsCount(reqCount)
                .featuresCount(featCount)
                .complexityScore(complexity)
                .feasibilityRating("HIGH")
                .suggestedNextStep("Generate Requirements & Architecture")
                .build();
    }

    private String computeHash(String text) {
        if (text == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(text.hashCode());
        }
    }
}
