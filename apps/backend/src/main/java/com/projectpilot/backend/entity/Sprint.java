package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String goal;

    @Column(name = "sprint_number")
    private Integer sprintNumber = 1;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 50)
    private String status = "PLANNED";

    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Sprint() {}

    public Sprint(UUID id, Project project, String name, String goal, Integer sprintNumber,
                  LocalDate startDate, LocalDate endDate, String status, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.name = name;
        this.goal = goal;
        this.sprintNumber = sprintNumber != null ? sprintNumber : 1;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status != null ? status : "PLANNED";
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Integer getSprintNumber() { return sprintNumber; }
    public void setSprintNumber(Integer sprintNumber) { this.sprintNumber = sprintNumber; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

