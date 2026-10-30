package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "features")
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "feature_code", nullable = false, length = 50)
    private String featureCode;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 20)
    private String priority;

    @Column(nullable = false, length = 20)
    private String complexity;

    @Column(name = "taxonomy_tag", length = 50)
    private String taxonomyTag = "INFERENCE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Feature() {}

    public Feature(UUID id, Project project, String featureCode, String title, String description,
                   String category, String priority, String complexity, String taxonomyTag, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.featureCode = featureCode;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.complexity = complexity;
        this.taxonomyTag = taxonomyTag != null ? taxonomyTag : "INFERENCE";
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getFeatureCode() { return featureCode; }
    public void setFeatureCode(String featureCode) { this.featureCode = featureCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getComplexity() { return complexity; }
    public void setComplexity(String complexity) { this.complexity = complexity; }

    public String getTaxonomyTag() { return taxonomyTag; }
    public void setTaxonomyTag(String taxonomyTag) { this.taxonomyTag = taxonomyTag; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private UUID id;
        private Project project;
        private String featureCode;
        private String title;
        private String description;
        private String category;
        private String priority;
        private String complexity;
        private String taxonomyTag = "INFERENCE";
        private ZonedDateTime createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder featureCode(String featureCode) { this.featureCode = featureCode; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder priority(String priority) { this.priority = priority; return this; }
        public Builder complexity(String complexity) { this.complexity = complexity; return this; }
        public Builder taxonomyTag(String taxonomyTag) { this.taxonomyTag = taxonomyTag; return this; }
        public Builder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Feature build() {
            return new Feature(id, project, featureCode, title, description, category, priority, complexity, taxonomyTag, createdAt);
        }
    }
}

