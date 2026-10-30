package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "api_definitions")
public class ApiDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "endpoint_path", nullable = false)
    private String endpointPath;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(nullable = false)
    private String summary;

    @Column(name = "request_schema", columnDefinition = "TEXT")
    private String requestSchema;

    @Column(name = "response_schema", columnDefinition = "TEXT")
    private String responseSchema;

    @Column(name = "auth_required")
    private Boolean authRequired = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public ApiDefinition() {}

    public ApiDefinition(UUID id, Project project, String endpointPath, String httpMethod, String summary,
                         String requestSchema, String responseSchema, Boolean authRequired, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.endpointPath = endpointPath;
        this.httpMethod = httpMethod;
        this.summary = summary;
        this.requestSchema = requestSchema;
        this.responseSchema = responseSchema;
        this.authRequired = authRequired != null ? authRequired : true;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getEndpointPath() { return endpointPath; }
    public void setEndpointPath(String endpointPath) { this.endpointPath = endpointPath; }

    public String getHttpMethod() { return httpMethod; }
    public void setHttpMethod(String httpMethod) { this.httpMethod = httpMethod; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getRequestSchema() { return requestSchema; }
    public void setRequestSchema(String requestSchema) { this.requestSchema = requestSchema; }

    public String getResponseSchema() { return responseSchema; }
    public void setResponseSchema(String responseSchema) { this.responseSchema = responseSchema; }

    public Boolean getAuthRequired() { return authRequired; }
    public void setAuthRequired(Boolean authRequired) { this.authRequired = authRequired; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

