package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(length = 50)
    private String status = "PLANNING";

    @Column(name = "health_score")
    private Integer healthScore = 100;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    public Project() {}

    public Project(UUID id, String title, String description, User owner, String status, Integer healthScore, ZonedDateTime createdAt, ZonedDateTime updatedAt, ZonedDateTime deletedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.status = status != null ? status : "PLANNING";
        this.healthScore = healthScore != null ? healthScore : 100;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
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

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }

    public ZonedDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(ZonedDateTime deletedAt) { this.deletedAt = deletedAt; }

    public static class Builder {
        private UUID id;
        private String title;
        private String description;
        private User owner;
        private String status = "PLANNING";
        private Integer healthScore = 100;
        private ZonedDateTime createdAt;
        private ZonedDateTime updatedAt;
        private ZonedDateTime deletedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder owner(User owner) { this.owner = owner; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder healthScore(Integer healthScore) { this.healthScore = healthScore; return this; }
        public Builder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder deletedAt(ZonedDateTime deletedAt) { this.deletedAt = deletedAt; return this; }

        public Project build() {
            return new Project(id, title, description, owner, status, healthScore, createdAt, updatedAt, deletedAt);
        }
    }
}
