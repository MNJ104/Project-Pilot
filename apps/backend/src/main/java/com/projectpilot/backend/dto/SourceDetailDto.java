package com.projectpilot.backend.dto;

import java.util.Map;
import java.util.UUID;

public class SourceDetailDto extends SourceResponseDto {

    private String rawContent;
    private String normalizedContent;
    private Map<String, Object> metadata;

    public SourceDetailDto() {
        super();
    }

    public SourceDetailDto(UUID id, UUID projectId, String sourceType, String url, String title, String contentHash, String createdAt, String summaryPreview, String detectedDomain, Integer requirementsCount, Integer featuresCount, String complexityScore, String feasibilityRating, String suggestedNextStep, String rawContent, String normalizedContent, Map<String, Object> metadata) {
        super(id, projectId, sourceType, url, title, contentHash, createdAt, summaryPreview, detectedDomain, requirementsCount, featuresCount, complexityScore, feasibilityRating, suggestedNextStep);
        this.rawContent = rawContent;
        this.normalizedContent = normalizedContent;
        this.metadata = metadata;
    }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getNormalizedContent() { return normalizedContent; }
    public void setNormalizedContent(String normalizedContent) { this.normalizedContent = normalizedContent; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
