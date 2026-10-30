package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "risks")
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer probability = 5;

    @Column(nullable = false)
    private Integer impact = 5;

    @Column(name = "severity_score", nullable = false)
    private Integer severityScore = 25;

    @Column(name = "mitigation_strategy", columnDefinition = "TEXT", nullable = false)
    private String mitigationStrategy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Risk() {}

    public Risk(UUID id, Project project, String category, String description,
                Integer probability, Integer impact, Integer severityScore,
                String mitigationStrategy, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.category = category;
        this.description = description;
        this.probability = probability != null ? probability : 5;
        this.impact = impact != null ? impact : 5;
        this.severityScore = severityScore != null ? severityScore : (this.probability * this.impact);
        this.mitigationStrategy = mitigationStrategy;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getProbability() { return probability; }
    public void setProbability(Integer probability) {
        this.probability = probability;
        if (this.impact != null) this.severityScore = this.probability * this.impact;
    }

    public Integer getImpact() { return impact; }
    public void setImpact(Integer impact) {
        this.impact = impact;
        if (this.probability != null) this.severityScore = this.probability * this.impact;
    }

    public Integer getSeverityScore() { return severityScore; }
    public void setSeverityScore(Integer severityScore) { this.severityScore = severityScore; }

    public String getMitigationStrategy() { return mitigationStrategy; }
    public void setMitigationStrategy(String mitigationStrategy) { this.mitigationStrategy = mitigationStrategy; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

