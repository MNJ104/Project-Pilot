package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "requirements")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "req_code", nullable = false, length = 50)
    private String reqCode;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 20)
    private String priority;

    @Column(name = "taxonomy_tag", length = 50)
    private String taxonomyTag = "FACT";

    @Column(name = "confidence_score", precision = 3, scale = 2)
    private BigDecimal confidenceScore = new BigDecimal("0.95");

    @Column(columnDefinition = "TEXT")
    private String dependencies;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    public Requirement() {}

    public Requirement(UUID id, Project project, String reqCode, String title, String description,
                       String category, String priority, String taxonomyTag, BigDecimal confidenceScore,
                       String dependencies, ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.project = project;
        this.reqCode = reqCode;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.taxonomyTag = taxonomyTag != null ? taxonomyTag : "FACT";
        this.confidenceScore = confidenceScore != null ? confidenceScore : new BigDecimal("0.95");
        this.dependencies = dependencies;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getReqCode() { return reqCode; }
    public void setReqCode(String reqCode) { this.reqCode = reqCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getTaxonomyTag() { return taxonomyTag; }
    public void setTaxonomyTag(String taxonomyTag) { this.taxonomyTag = taxonomyTag; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getDependencies() { return dependencies; }
    public void setDependencies(String dependencies) { this.dependencies = dependencies; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Builder {
        private UUID id;
        private Project project;
        private String reqCode;
        private String title;
        private String description;
        private String category;
        private String priority;
        private String taxonomyTag = "FACT";
        private BigDecimal confidenceScore = new BigDecimal("0.95");
        private String dependencies;
        private ZonedDateTime createdAt;
        private ZonedDateTime updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder reqCode(String reqCode) { this.reqCode = reqCode; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder priority(String priority) { this.priority = priority; return this; }
        public Builder taxonomyTag(String taxonomyTag) { this.taxonomyTag = taxonomyTag; return this; }
        public Builder confidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder dependencies(String dependencies) { this.dependencies = dependencies; return this; }
        public Builder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Requirement build() {
            return new Requirement(id, project, reqCode, title, description, category, priority, taxonomyTag, confidenceScore, dependencies, createdAt, updatedAt);
        }
    }
}

