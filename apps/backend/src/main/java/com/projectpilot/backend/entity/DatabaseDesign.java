package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "database_designs")
public class DatabaseDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "db_type", nullable = false, length = 50)
    private String dbType = "PostgreSQL";

    @Column(name = "mermaid_er_diagram", columnDefinition = "TEXT", nullable = false)
    private String mermaidErDiagram;

    @Column(name = "migration_sql", columnDefinition = "TEXT", nullable = false)
    private String migrationSql;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public DatabaseDesign() {}

    public DatabaseDesign(UUID id, Project project, String dbType, String mermaidErDiagram, String migrationSql, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.dbType = dbType != null ? dbType : "PostgreSQL";
        this.mermaidErDiagram = mermaidErDiagram;
        this.migrationSql = migrationSql;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getDbType() { return dbType; }
    public void setDbType(String dbType) { this.dbType = dbType; }

    public String getMermaidErDiagram() { return mermaidErDiagram; }
    public void setMermaidErDiagram(String mermaidErDiagram) { this.mermaidErDiagram = mermaidErDiagram; }

    public String getMigrationSql() { return migrationSql; }
    public void setMigrationSql(String migrationSql) { this.migrationSql = migrationSql; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

