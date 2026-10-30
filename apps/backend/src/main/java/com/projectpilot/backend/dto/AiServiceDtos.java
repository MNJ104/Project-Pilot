package com.projectpilot.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * DTOs for AI Service communication (Java mirrors of Python Pydantic schemas).
 * All classes are static inner classes for convenience.
 */
public class AiServiceDtos {

    // ─── Common Request ───────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiGenerateRequest {
        @JsonProperty("project_title")
        public String projectTitle;
        @JsonProperty("project_description")
        public String projectDescription;
        @JsonProperty("requirements_context")
        public String requirementsContext = "";

        public AiGenerateRequest() {}
        public AiGenerateRequest(String projectTitle, String projectDescription, String requirementsContext) {
            this.projectTitle = projectTitle;
            this.projectDescription = projectDescription;
            this.requirementsContext = requirementsContext != null ? requirementsContext : "";
        }
    }

    // ─── Architecture ─────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ArchitectureComponentDto {
        public String name;
        @JsonProperty("tech_stack")
        public String techStack;
        public String responsibility;
        @JsonProperty("communication_protocol")
        public String communicationProtocol;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ArchitectureResultDto {
        public String style;
        public String summary;
        @JsonProperty("mermaid_diagram")
        public String mermaidDiagram;
        @JsonProperty("deployment_strategy")
        public String deploymentStrategy;
        public List<ArchitectureComponentDto> components;
    }

    // ─── Database ─────────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DatabaseEntityDto {
        @JsonProperty("table_name")
        public String tableName;
        public List<String> columns;
        @JsonProperty("primary_key")
        public String primaryKey;
        @JsonProperty("foreign_keys")
        public List<String> foreignKeys;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DatabaseDesignResultDto {
        @JsonProperty("db_type")
        public String dbType;
        @JsonProperty("mermaid_er_diagram")
        public String mermaidErDiagram;
        @JsonProperty("migration_sql")
        public String migrationSql;
        public List<DatabaseEntityDto> entities;
    }

    // ─── API Design ───────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ApiEndpointDto {
        @JsonProperty("endpoint_path")
        public String endpointPath;
        @JsonProperty("http_method")
        public String httpMethod;
        public String summary;
        @JsonProperty("request_schema")
        public String requestSchema;
        @JsonProperty("response_schema")
        public String responseSchema;
        @JsonProperty("auth_required")
        public boolean authRequired;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ApiDesignResultDto {
        public String title;
        public String version;
        @JsonProperty("base_path")
        public String basePath;
        public List<ApiEndpointDto> endpoints;
        @JsonProperty("openapi_spec_json")
        public String openapiSpecJson;
    }

    // ─── Tech Stack ───────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TechStackItemDto {
        public String category;
        @JsonProperty("technology_name")
        public String technologyName;
        public String justification;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WireframeItemDto {
        @JsonProperty("page_name")
        public String pageName;
        @JsonProperty("layout_description")
        public String layoutDescription;
        @JsonProperty("components_list")
        public List<String> componentsList;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TechStackResultDto {
        public List<TechStackItemDto> recommendations;
        public List<WireframeItemDto> wireframes;
        public String summary;
    }

    // ─── Sprints ──────────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SprintTaskDto {
        public String title;
        public String description;
        public String status;
        public String priority;
        @JsonProperty("story_points")
        public Integer storyPoints;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SprintDto {
        public String name;
        @JsonProperty("sprint_number")
        public Integer sprintNumber;
        public String goal;
        @JsonProperty("start_date")
        public String startDate;
        @JsonProperty("end_date")
        public String endDate;
        public List<SprintTaskDto> tasks;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SprintPlanResultDto {
        public List<SprintDto> sprints;
        @JsonProperty("total_story_points")
        public Integer totalStoryPoints;
        @JsonProperty("estimated_weeks")
        public Integer estimatedWeeks;
    }

    // ─── Cost & Risk ──────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CostEstimateResultDto {
        @JsonProperty("total_monthly_usd")
        public Double totalMonthlyUsd;
        @JsonProperty("compute_usd")
        public Double computeUsd;
        @JsonProperty("database_usd")
        public Double databaseUsd;
        @JsonProperty("storage_usd")
        public Double storageUsd;
        @JsonProperty("ai_inference_usd")
        public Double aiInferenceUsd;
        @JsonProperty("breakdown_notes")
        public String breakdownNotes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RiskItemDto {
        public String category;
        public String description;
        public Integer probability;
        public Integer impact;
        @JsonProperty("severity_score")
        public Integer severityScore;
        @JsonProperty("mitigation_strategy")
        public String mitigationStrategy;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RiskPredictionResultDto {
        public List<RiskItemDto> risks;
        @JsonProperty("overall_risk_level")
        public String overallRiskLevel;
    }

    // ─── Documentation ────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DocumentationResultDto {
        @JsonProperty("project_title")
        public String projectTitle;
        @JsonProperty("srs_markdown")
        public String srsMarkdown;
        @JsonProperty("executive_summary")
        public String executiveSummary;
        @JsonProperty("tech_stack_summary")
        public String techStackSummary;
    }

    // ─── Chat ─────────────────────────────────────────────────────────────────
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatMessageDto {
        public String role;
        public String content;
        public ChatMessageDto() {}
        public ChatMessageDto(String role, String content) { this.role = role; this.content = content; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatRequestDto {
        @JsonProperty("project_title")
        public String projectTitle;
        @JsonProperty("project_context")
        public String projectContext;
        public List<ChatMessageDto> messages;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatResponseDto {
        public String reply;
        @JsonProperty("taxonomy_tag")
        public String taxonomyTag;
    }
}

