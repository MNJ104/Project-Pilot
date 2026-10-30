package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tech_stack_recommendations")
public class TechStackRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "technology_name", nullable = false, length = 100)
    private String technologyName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String justification;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public TechStackRecommendation() {}

    public TechStackRecommendation(UUID id, Project project, String category, String technologyName, String justification, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.category = category;
        this.technologyName = technologyName;
        this.justification = justification;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTechnologyName() { return technologyName; }
    public void setTechnologyName(String technologyName) { this.technologyName = technologyName; }

    public String getJustification() { return justification; }
    public void setJustification(String justification) { this.justification = justification; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

