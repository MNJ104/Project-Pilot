package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(nullable = false)
    private String title;

    @Column(name = "content_hash", length = 64)
    private String contentHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "extracted_by")
    private User extractedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Source() {}

    public Source(UUID id, Project project, String sourceType, String url, String title, String contentHash, User extractedBy, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.sourceType = sourceType;
        this.url = url;
        this.title = title;
        this.contentHash = contentHash;
        this.extractedBy = extractedBy;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public User getExtractedBy() { return extractedBy; }
    public void setExtractedBy(User extractedBy) { this.extractedBy = extractedBy; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private UUID id;
        private Project project;
        private String sourceType;
        private String url;
        private String title;
        private String contentHash;
        private User extractedBy;
        private ZonedDateTime createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder sourceType(String sourceType) { this.sourceType = sourceType; return this; }
        public Builder url(String url) { this.url = url; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder contentHash(String contentHash) { this.contentHash = contentHash; return this; }
        public Builder extractedBy(User extractedBy) { this.extractedBy = extractedBy; return this; }
        public Builder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Source build() {
            return new Source(id, project, sourceType, url, title, contentHash, extractedBy, createdAt);
        }
    }
}
