package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "architectures")
public class Architecture {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 100)
    private String style;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(name = "mermaid_diagram", columnDefinition = "TEXT", nullable = false)
    private String mermaidDiagram;

    @Column(name = "deployment_strategy", columnDefinition = "TEXT")
    private String deploymentStrategy;

    @OneToMany(mappedBy = "architecture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArchitectureComponent> components = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Architecture() {}

    public Architecture(UUID id, Project project, String style, String summary, String mermaidDiagram, String deploymentStrategy, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.style = style;
        this.summary = summary;
        this.mermaidDiagram = mermaidDiagram;
        this.deploymentStrategy = deploymentStrategy;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getMermaidDiagram() { return mermaidDiagram; }
    public void setMermaidDiagram(String mermaidDiagram) { this.mermaidDiagram = mermaidDiagram; }

    public String getDeploymentStrategy() { return deploymentStrategy; }
    public void setDeploymentStrategy(String deploymentStrategy) { this.deploymentStrategy = deploymentStrategy; }

    public List<ArchitectureComponent> getComponents() { return components; }
    public void setComponents(List<ArchitectureComponent> components) { this.components = components; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

