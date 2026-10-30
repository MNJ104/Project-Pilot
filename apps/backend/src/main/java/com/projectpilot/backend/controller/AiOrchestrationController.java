package com.projectpilot.backend.controller;

import com.projectpilot.backend.dto.AiServiceDtos.*;
import com.projectpilot.backend.entity.*;
import com.projectpilot.backend.repository.*;
import com.projectpilot.backend.service.AiOrchestrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for triggering AI artifact generation.
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}")
public class AiOrchestrationController {

    private final AiOrchestrationService orchestrationService;
    private final ArchitectureRepository architectureRepository;
    private final DatabaseDesignRepository databaseDesignRepository;
    private final ApiDefinitionRepository apiDefinitionRepository;
    private final TechStackRecommendationRepository techStackRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final CostEstimateRepository costEstimateRepository;
    private final RiskRepository riskRepository;

    public AiOrchestrationController(AiOrchestrationService orchestrationService,
                                      ArchitectureRepository architectureRepository,
                                      DatabaseDesignRepository databaseDesignRepository,
                                      ApiDefinitionRepository apiDefinitionRepository,
                                      TechStackRecommendationRepository techStackRepository,
                                      SprintRepository sprintRepository,
                                      TaskRepository taskRepository,
                                      CostEstimateRepository costEstimateRepository,
                                      RiskRepository riskRepository) {
        this.orchestrationService = orchestrationService;
        this.architectureRepository = architectureRepository;
        this.databaseDesignRepository = databaseDesignRepository;
        this.apiDefinitionRepository = apiDefinitionRepository;
        this.techStackRepository = techStackRepository;
        this.sprintRepository = sprintRepository;
        this.taskRepository = taskRepository;
        this.costEstimateRepository = costEstimateRepository;
        this.riskRepository = riskRepository;
    }

    // ─── Generation Endpoints ─────────────────────────────────────────────────

    @PostMapping("/generate/architecture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Architecture> generateArchitecture(@PathVariable UUID projectId) {
        return ResponseEntity.ok(orchestrationService.generateAndSaveArchitecture(projectId));
    }

    @PostMapping("/generate/database")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DatabaseDesign> generateDatabase(@PathVariable UUID projectId) {
        return ResponseEntity.ok(orchestrationService.generateAndSaveDatabase(projectId));
    }

    @PostMapping("/generate/api-design")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApiDefinition>> generateApiDesign(@PathVariable UUID projectId) {
        return ResponseEntity.ok(orchestrationService.generateAndSaveApiDesign(projectId));
    }

    @PostMapping("/generate/tech-stack")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TechStackRecommendation>> generateTechStack(@PathVariable UUID projectId) {
        return ResponseEntity.ok(orchestrationService.generateAndSaveTechStack(projectId));
    }

    @PostMapping("/generate/sprints")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Sprint>> generateSprints(@PathVariable UUID projectId) {
        return ResponseEntity.ok(orchestrationService.generateAndSaveSprints(projectId));
    }

    @PostMapping("/generate/cost-risk")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> generateCostRisk(@PathVariable UUID projectId) {
        CostEstimate cost = orchestrationService.generateAndSaveCostEstimate(projectId);
        List<Risk> risks = orchestrationService.generateAndSaveRisks(projectId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("cost_estimate", cost);
        result.put("risks", risks);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> generateFullBlueprint(@PathVariable UUID projectId) {
        orchestrationService.generateFullBlueprint(projectId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "GENERATED");
        result.put("project_id", projectId);
        result.put("message", "Full blueprint generated successfully. Use /artifacts to retrieve results.");
        result.put("generated_at", new Date().toInstant().toString());
        return ResponseEntity.ok(result);
    }

    // ─── Artifact Retrieval Endpoints ─────────────────────────────────────────

    @GetMapping("/artifacts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAllArtifacts(@PathVariable UUID projectId) {
        Map<String, Object> artifacts = new LinkedHashMap<>();
        artifacts.put("architecture", architectureRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId).orElse(null));
        artifacts.put("database_design", databaseDesignRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId).orElse(null));
        artifacts.put("api_endpoints", apiDefinitionRepository.findByProjectId(projectId));
        artifacts.put("tech_stack", techStackRepository.findByProjectId(projectId));
        artifacts.put("sprints", sprintRepository.findByProjectIdOrderBySprintNumberAsc(projectId));
        artifacts.put("cost_estimate", costEstimateRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId).orElse(null));
        artifacts.put("risks", riskRepository.findByProjectId(projectId));
        return ResponseEntity.ok(artifacts);
    }

    @GetMapping("/architecture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<Architecture>> getArchitecture(@PathVariable UUID projectId) {
        return ResponseEntity.ok(architectureRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId));
    }

    @GetMapping("/database")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<DatabaseDesign>> getDatabase(@PathVariable UUID projectId) {
        return ResponseEntity.ok(databaseDesignRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId));
    }

    @GetMapping("/api-design")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApiDefinition>> getApiDesign(@PathVariable UUID projectId) {
        return ResponseEntity.ok(apiDefinitionRepository.findByProjectId(projectId));
    }

    @GetMapping("/tech-stack")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TechStackRecommendation>> getTechStack(@PathVariable UUID projectId) {
        return ResponseEntity.ok(techStackRepository.findByProjectId(projectId));
    }

    @GetMapping("/sprints")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Sprint>> getSprints(@PathVariable UUID projectId) {
        return ResponseEntity.ok(sprintRepository.findByProjectIdOrderBySprintNumberAsc(projectId));
    }

    @GetMapping("/cost-risk")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCostRisk(@PathVariable UUID projectId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("cost_estimate", costEstimateRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId).orElse(null));
        result.put("risks", riskRepository.findByProjectId(projectId));
        return ResponseEntity.ok(result);
    }

    // ─── Task Status Update (Kanban) ──────────────────────────────────────────

    @PatchMapping("/tasks/{taskId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateTaskStatus(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null || !List.of("TODO", "IN_PROGRESS", "BLOCKED", "DONE").contains(newStatus)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Must be TODO, IN_PROGRESS, BLOCKED, or DONE."));
        }
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new com.projectpilot.backend.exception.ResourceNotFoundException("Task not found: " + taskId));
        task.setStatus(newStatus);
        taskRepository.save(task);
        return ResponseEntity.ok(Map.of("id", taskId, "status", newStatus, "updated", true));
    }

    // ─── Chat Endpoint ────────────────────────────────────────────────────────

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatResponseDto> chat(
            @PathVariable UUID projectId,
            @RequestBody ChatRequestDto chatRequest) {
        return ResponseEntity.ok(orchestrationService.chat(projectId, chatRequest));
    }
}

