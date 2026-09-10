package com.projectpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;

public class IngestSourceDto {

    private UUID projectId;

    @NotBlank(message = "Source type is required")
    private String sourceType;

    private String url;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Raw content is required")
    private String rawContent;

    private String normalizedContent;
    private Map<String, Object> metadata;

    public IngestSourceDto() {}

    public IngestSourceDto(UUID projectId, String sourceType, String url, String title, String rawContent, String normalizedContent, Map<String, Object> metadata) {
        this.projectId = projectId;
        this.sourceType = sourceType;
        this.url = url;
        this.title = title;
        this.rawContent = rawContent;
        this.normalizedContent = normalizedContent;
        this.metadata = metadata;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getNormalizedContent() { return normalizedContent; }
    public void setNormalizedContent(String normalizedContent) { this.normalizedContent = normalizedContent; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

    public static class Builder {
        private UUID projectId;
        private String sourceType;
        private String url;
        private String title;
        private String rawContent;
        private String normalizedContent;
        private Map<String, Object> metadata;

        public Builder projectId(UUID projectId) { this.projectId = projectId; return this; }
        public Builder sourceType(String sourceType) { this.sourceType = sourceType; return this; }
        public Builder url(String url) { this.url = url; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder rawContent(String rawContent) { this.rawContent = rawContent; return this; }
        public Builder normalizedContent(String normalizedContent) { this.normalizedContent = normalizedContent; return this; }
        public Builder metadata(Map<String, Object> metadata) { this.metadata = metadata; return this; }

        public IngestSourceDto build() {
            return new IngestSourceDto(projectId, sourceType, url, title, rawContent, normalizedContent, metadata);
        }
    }
}
