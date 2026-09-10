package com.projectpilot.backend.dto;

import java.util.UUID;

public class ProjectDto {

    private UUID id;
    private String title;
    private String description;
    private UUID ownerId;
    private String status;
    private Integer healthScore;
    private String createdAt;

    public ProjectDto() {}

    public ProjectDto(UUID id, String title, String description, UUID ownerId, String status, Integer healthScore, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ownerId = ownerId;
        this.status = status;
        this.healthScore = healthScore;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private UUID id;
        private String title;
        private String description;
        private UUID ownerId;
        private String status;
        private Integer healthScore;
        private String createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder ownerId(UUID ownerId) { this.ownerId = ownerId; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder healthScore(Integer healthScore) { this.healthScore = healthScore; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public ProjectDto build() {
            return new ProjectDto(id, title, description, ownerId, status, healthScore, createdAt);
        }
    }
}
