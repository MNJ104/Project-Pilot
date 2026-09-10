package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "source_documents")
public class SourceDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private Source source;

    @Column(name = "raw_content", nullable = false, columnDefinition = "TEXT")
    private String rawContent;

    @Column(name = "normalized_content", columnDefinition = "TEXT")
    private String normalizedContent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public SourceDocument() {}

    public SourceDocument(UUID id, Source source, String rawContent, String normalizedContent, ZonedDateTime createdAt) {
        this.id = id;
        this.source = source;
        this.rawContent = rawContent;
        this.normalizedContent = normalizedContent;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Source getSource() { return source; }
    public void setSource(Source source) { this.source = source; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getNormalizedContent() { return normalizedContent; }
    public void setNormalizedContent(String normalizedContent) { this.normalizedContent = normalizedContent; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private UUID id;
        private Source source;
        private String rawContent;
        private String normalizedContent;
        private ZonedDateTime createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder source(Source source) { this.source = source; return this; }
        public Builder rawContent(String rawContent) { this.rawContent = rawContent; return this; }
        public Builder normalizedContent(String normalizedContent) { this.normalizedContent = normalizedContent; return this; }
        public Builder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SourceDocument build() {
            return new SourceDocument(id, source, rawContent, normalizedContent, createdAt);
        }
    }
}
