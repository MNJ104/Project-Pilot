package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "wireframes")
public class Wireframe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "page_name", nullable = false, length = 100)
    private String pageName;

    @Column(name = "layout_description", columnDefinition = "TEXT", nullable = false)
    private String layoutDescription;

    @Column(name = "components_list", columnDefinition = "TEXT")
    private String componentsList;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Wireframe() {}

    public Wireframe(UUID id, Project project, String pageName, String layoutDescription, String componentsList, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.pageName = pageName;
        this.layoutDescription = layoutDescription;
        this.componentsList = componentsList;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getPageName() { return pageName; }
    public void setPageName(String pageName) { this.pageName = pageName; }

    public String getLayoutDescription() { return layoutDescription; }
    public void setLayoutDescription(String layoutDescription) { this.layoutDescription = layoutDescription; }

    public String getComponentsList() { return componentsList; }
    public void setComponentsList(String componentsList) { this.componentsList = componentsList; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

