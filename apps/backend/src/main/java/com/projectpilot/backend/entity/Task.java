package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String status = "TODO";

    @Column(length = 20)
    private String priority = "MEDIUM";

    @Column(name = "story_points")
    private Integer storyPoints = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    public Task() {}

    public Task(UUID id, Sprint sprint, Project project, String title, String description,
                String status, String priority, Integer storyPoints, User assignee,
                ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.sprint = sprint;
        this.project = project;
        this.title = title;
        this.description = description;
        this.status = status != null ? status : "TODO";
        this.priority = priority != null ? priority : "MEDIUM";
        this.storyPoints = storyPoints != null ? storyPoints : 1;
        this.assignee = assignee;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Integer getStoryPoints() { return storyPoints; }
    public void setStoryPoints(Integer storyPoints) { this.storyPoints = storyPoints; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}

