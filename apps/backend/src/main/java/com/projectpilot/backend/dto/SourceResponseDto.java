package com.projectpilot.backend.dto;

import java.util.UUID;

public class SourceResponseDto {

    private UUID id;
    private UUID projectId;
    private String sourceType;
    private String url;
    private String title;
    private String contentHash;
    private String createdAt;
    private String summaryPreview;
    private String detectedDomain;
    private Integer requirementsCount;
    private Integer featuresCount;
    private String complexityScore;
    private String feasibilityRating;
    private String suggestedNextStep;

    public SourceResponseDto() {}

    public SourceResponseDto(UUID id, UUID projectId, String sourceType, String url, String title, String contentHash, String createdAt, String summaryPreview, String detectedDomain, Integer requirementsCount, Integer featuresCount, String complexityScore, String feasibilityRating, String suggestedNextStep) {
        this.id = id;
        this.projectId = projectId;
        this.sourceType = sourceType;
        this.url = url;
        this.title = title;
        this.contentHash = contentHash;
        this.createdAt = createdAt;
        this.summaryPreview = summaryPreview;
        this.detectedDomain = detectedDomain;
        this.requirementsCount = requirementsCount;
        this.featuresCount = featuresCount;
        this.complexityScore = complexityScore;
        this.feasibilityRating = feasibilityRating;
        this.suggestedNextStep = suggestedNextStep;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getSummaryPreview() { return summaryPreview; }
    public void setSummaryPreview(String summaryPreview) { this.summaryPreview = summaryPreview; }

    public String getDetectedDomain() { return detectedDomain; }
    public void setDetectedDomain(String detectedDomain) { this.detectedDomain = detectedDomain; }

    public Integer getRequirementsCount() { return requirementsCount; }
    public void setRequirementsCount(Integer requirementsCount) { this.requirementsCount = requirementsCount; }

    public Integer getFeaturesCount() { return featuresCount; }
    public void setFeaturesCount(Integer featuresCount) { this.featuresCount = featuresCount; }

    public String getComplexityScore() { return complexityScore; }
    public void setComplexityScore(String complexityScore) { this.complexityScore = complexityScore; }

    public String getFeasibilityRating() { return feasibilityRating; }
    public void setFeasibilityRating(String feasibilityRating) { this.feasibilityRating = feasibilityRating; }

    public String getSuggestedNextStep() { return suggestedNextStep; }
    public void setSuggestedNextStep(String suggestedNextStep) { this.suggestedNextStep = suggestedNextStep; }

    public static class Builder {
        private UUID id;
        private UUID projectId;
        private String sourceType;
        private String url;
        private String title;
        private String contentHash;
        private String createdAt;
        private String summaryPreview;
        private String detectedDomain;
        private Integer requirementsCount;
        private Integer featuresCount;
        private String complexityScore;
        private String feasibilityRating;
        private String suggestedNextStep;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder projectId(UUID projectId) { this.projectId = projectId; return this; }
        public Builder sourceType(String sourceType) { this.sourceType = sourceType; return this; }
        public Builder url(String url) { this.url = url; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder contentHash(String contentHash) { this.contentHash = contentHash; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public Builder summaryPreview(String summaryPreview) { this.summaryPreview = summaryPreview; return this; }
        public Builder detectedDomain(String detectedDomain) { this.detectedDomain = detectedDomain; return this; }
        public Builder requirementsCount(Integer requirementsCount) { this.requirementsCount = requirementsCount; return this; }
        public Builder featuresCount(Integer featuresCount) { this.featuresCount = featuresCount; return this; }
        public Builder complexityScore(String complexityScore) { this.complexityScore = complexityScore; return this; }
        public Builder feasibilityRating(String feasibilityRating) { this.feasibilityRating = feasibilityRating; return this; }
        public Builder suggestedNextStep(String suggestedNextStep) { this.suggestedNextStep = suggestedNextStep; return this; }

        public SourceResponseDto build() {
            return new SourceResponseDto(id, projectId, sourceType, url, title, contentHash, createdAt, summaryPreview, detectedDomain, requirementsCount, featuresCount, complexityScore, feasibilityRating, suggestedNextStep);
        }
    }
}
