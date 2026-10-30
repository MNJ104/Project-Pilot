package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.AiServiceDtos.*;
import com.projectpilot.backend.entity.*;
import com.projectpilot.backend.exception.ResourceNotFoundException;
import com.projectpilot.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Orchestrates AI generation calls and persists results to the database.
 */
@Service
@Transactional
public class AiOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(AiOrchestrationService.class);

    private final AiServiceClient aiClient;
    private final ProjectRepository projectRepository;
    private final ArchitectureRepository architectureRepository;
    private final DatabaseDesignRepository databaseDesignRepository;
    private final ApiDefinitionRepository apiDefinitionRepository;
    private final TechStackRecommendationRepository techStackRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final CostEstimateRepository costEstimateRepository;
    private final RiskRepository riskRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public AiOrchestrationService(AiServiceClient aiClient,
                                   ProjectRepository projectRepository,
                                   ArchitectureRepository architectureRepository,
                                   DatabaseDesignRepository databaseDesignRepository,
                                   ApiDefinitionRepository apiDefinitionRepository,
                                   TechStackRecommendationRepository techStackRepository,
                                   SprintRepository sprintRepository,
                                   TaskRepository taskRepository,
                                   CostEstimateRepository costEstimateRepository,
                                   RiskRepository riskRepository,
                                   ConversationRepository conversationRepository,
                                   MessageRepository messageRepository) {
        this.aiClient = aiClient;
        this.projectRepository = projectRepository;
        this.architectureRepository = architectureRepository;
        this.databaseDesignRepository = databaseDesignRepository;
        this.apiDefinitionRepository = apiDefinitionRepository;
        this.techStackRepository = techStackRepository;
        this.sprintRepository = sprintRepository;
        this.taskRepository = taskRepository;
        this.costEstimateRepository = costEstimateRepository;
        this.riskRepository = riskRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    private Project getProject(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
    }

    // ─── Architecture ─────────────────────────────────────────────────────────

    public Architecture generateAndSaveArchitecture(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating architecture for project: {}", project.getTitle());

        ArchitectureResultDto result = aiClient.generateArchitecture(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        // Delete existing architecture for idempotency
        architectureRepository.deleteByProjectId(projectId);

        Architecture arch = new Architecture();
        arch.setProject(project);
        arch.setStyle(result.style != null ? result.style : "Modular Architecture");
        arch.setSummary(result.summary != null ? result.summary : "AI-generated architecture");
        arch.setMermaidDiagram(result.mermaidDiagram != null ? result.mermaidDiagram : "graph TD\n  A --> B");
        arch.setDeploymentStrategy(result.deploymentStrategy);

        Architecture saved = architectureRepository.save(arch);

        // Save components
        if (result.components != null) {
            for (ArchitectureComponentDto compDto : result.components) {
                ArchitectureComponent comp = new ArchitectureComponent();
                comp.setArchitecture(saved);
                comp.setName(compDto.name != null ? compDto.name : "Component");
                comp.setTechStack(compDto.techStack);
                comp.setResponsibility(compDto.responsibility);
                comp.setCommunicationProtocol(compDto.communicationProtocol);
                saved.getComponents().add(comp);
            }
            architectureRepository.save(saved);
        }

        log.info("Architecture saved with {} components", saved.getComponents().size());
        return saved;
    }

    // ─── Database Design ──────────────────────────────────────────────────────

    public DatabaseDesign generateAndSaveDatabase(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating database design for project: {}", project.getTitle());

        DatabaseDesignResultDto result = aiClient.generateDatabase(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        databaseDesignRepository.deleteByProjectId(projectId);

        DatabaseDesign design = new DatabaseDesign();
        design.setProject(project);
        design.setMermaidErDiagram(result.mermaidErDiagram != null ? result.mermaidErDiagram : "erDiagram\n  TABLE {}");
        design.setMigrationSql(result.migrationSql != null ? result.migrationSql : "-- No SQL generated");
        design.setDbType(result.dbType != null ? result.dbType : "PostgreSQL");

        DatabaseDesign saved = databaseDesignRepository.save(design);
        log.info("Database design saved: {} entities", result.entities != null ? result.entities.size() : 0);
        return saved;
    }

    // ─── API Design ───────────────────────────────────────────────────────────

    public List<ApiDefinition> generateAndSaveApiDesign(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating API design for project: {}", project.getTitle());

        ApiDesignResultDto result = aiClient.generateApiDesign(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        apiDefinitionRepository.deleteByProjectId(projectId);

        List<ApiDefinition> saved = new ArrayList<>();
        if (result.endpoints != null) {
            for (ApiEndpointDto ep : result.endpoints) {
                ApiDefinition api = new ApiDefinition();
                api.setProject(project);
                api.setEndpointPath(ep.endpointPath != null ? ep.endpointPath : "/unknown");
                api.setHttpMethod(ep.httpMethod != null ? ep.httpMethod : "GET");
                api.setSummary(ep.summary);
                api.setRequestSchema(ep.requestSchema);
                api.setResponseSchema(ep.responseSchema);
                api.setAuthRequired(ep.authRequired);
                saved.add(apiDefinitionRepository.save(api));
            }
        }

        log.info("API design saved: {} endpoints", saved.size());
        return saved;
    }

    // ─── Tech Stack ───────────────────────────────────────────────────────────

    public List<TechStackRecommendation> generateAndSaveTechStack(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating tech stack for project: {}", project.getTitle());

        TechStackResultDto result = aiClient.generateTechStack(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        techStackRepository.deleteByProjectId(projectId);

        List<TechStackRecommendation> saved = new ArrayList<>();
        if (result.recommendations != null) {
            for (TechStackItemDto item : result.recommendations) {
                TechStackRecommendation rec = new TechStackRecommendation();
                rec.setProject(project);
                rec.setCategory(item.category != null ? item.category : "GENERAL");
                rec.setTechnologyName(item.technologyName != null ? item.technologyName : "Unknown");
                rec.setJustification(item.justification);
                saved.add(techStackRepository.save(rec));
            }
        }

        log.info("Tech stack saved: {} recommendations", saved.size());
        return saved;
    }

    // ─── Sprints ──────────────────────────────────────────────────────────────

    public List<Sprint> generateAndSaveSprints(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating sprints for project: {}", project.getTitle());

        SprintPlanResultDto result = aiClient.generateSprints(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        // Delete tasks first via project (cascade-safe)
        taskRepository.deleteByProjectId(projectId);
        sprintRepository.deleteByProjectId(projectId);

        List<Sprint> savedSprints = new ArrayList<>();
        if (result.sprints != null) {
            for (SprintDto sprintDto : result.sprints) {
                Sprint sprint = new Sprint();
                sprint.setProject(project);
                sprint.setName(sprintDto.name != null ? sprintDto.name : "Sprint " + sprintDto.sprintNumber);
                sprint.setGoal(sprintDto.goal);
                sprint.setSprintNumber(sprintDto.sprintNumber != null ? sprintDto.sprintNumber : 1);
                sprint.setStatus("PLANNED");

                try {
                    if (sprintDto.startDate != null) sprint.setStartDate(LocalDate.parse(sprintDto.startDate));
                    if (sprintDto.endDate != null) sprint.setEndDate(LocalDate.parse(sprintDto.endDate));
                } catch (Exception e) {
                    log.warn("Could not parse sprint dates: {}", e.getMessage());
                }

                Sprint savedSprint = sprintRepository.save(sprint);

                if (sprintDto.tasks != null) {
                    for (SprintTaskDto taskDto : sprintDto.tasks) {
                        Task task = new Task();
                        task.setSprint(savedSprint);
                        task.setProject(project);
                        task.setTitle(taskDto.title != null ? taskDto.title : "Task");
                        task.setDescription(taskDto.description);
                        task.setStatus(taskDto.status != null ? taskDto.status : "TODO");
                        task.setPriority(taskDto.priority != null ? taskDto.priority : "MEDIUM");
                        task.setStoryPoints(taskDto.storyPoints != null ? taskDto.storyPoints : 3);
                        taskRepository.save(task);
                    }
                }
                savedSprints.add(savedSprint);
            }
        }

        log.info("Sprints saved: {} sprints", savedSprints.size());
        return savedSprints;
    }

    // ─── Cost Estimate ────────────────────────────────────────────────────────

    public CostEstimate generateAndSaveCostEstimate(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating cost estimate for project: {}", project.getTitle());

        CostEstimateResultDto result = aiClient.generateCostEstimate(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        costEstimateRepository.deleteByProjectId(projectId);

        CostEstimate cost = new CostEstimate();
        cost.setProject(project);
        cost.setTotalMonthlyUsd(toBigDecimal(result.totalMonthlyUsd));
        cost.setComputeUsd(toBigDecimal(result.computeUsd));
        cost.setDatabaseUsd(toBigDecimal(result.databaseUsd));
        cost.setStorageUsd(toBigDecimal(result.storageUsd));
        cost.setAiInferenceUsd(toBigDecimal(result.aiInferenceUsd));
        cost.setBreakdownNotes(result.breakdownNotes);

        return costEstimateRepository.save(cost);
    }

    // ─── Risk Prediction ──────────────────────────────────────────────────────

    public List<Risk> generateAndSaveRisks(UUID projectId) {
        Project project = getProject(projectId);
        log.info("Generating risks for project: {}", project.getTitle());

        RiskPredictionResultDto result = aiClient.generateRiskPrediction(
                project.getTitle(), project.getDescription() != null ? project.getDescription() : "", "");

        riskRepository.deleteByProjectId(projectId);

        List<Risk> savedRisks = new ArrayList<>();
        if (result.risks != null) {
            for (RiskItemDto riskDto : result.risks) {
                Risk risk = new Risk();
                risk.setProject(project);
                risk.setCategory(riskDto.category != null ? riskDto.category : "TECHNICAL");
                risk.setDescription(riskDto.description != null ? riskDto.description : "Identified risk");
                risk.setProbability(riskDto.probability != null ? riskDto.probability : 5);
                risk.setImpact(riskDto.impact != null ? riskDto.impact : 5);
                risk.setSeverityScore(riskDto.severityScore != null ? riskDto.severityScore :
                        (risk.getProbability() * risk.getImpact()));
                risk.setMitigationStrategy(riskDto.mitigationStrategy != null ? riskDto.mitigationStrategy : "Review and monitor.");
                savedRisks.add(riskRepository.save(risk));
            }
        }

        log.info("Risks saved: {} risks", savedRisks.size());
        return savedRisks;
    }

    // ─── Full Blueprint Generation ────────────────────────────────────────────

    public void generateFullBlueprint(UUID projectId) {
        log.info("Starting full blueprint generation for project: {}", projectId);
        generateAndSaveArchitecture(projectId);
        generateAndSaveDatabase(projectId);
        generateAndSaveApiDesign(projectId);
        generateAndSaveTechStack(projectId);
        generateAndSaveSprints(projectId);
        generateAndSaveCostEstimate(projectId);
        generateAndSaveRisks(projectId);
        log.info("Full blueprint generation complete for project: {}", projectId);
    }

    // ─── Chat ─────────────────────────────────────────────────────────────────

    public ChatResponseDto chat(UUID projectId, ChatRequestDto chatRequest) {
        Project project = getProject(projectId);
        chatRequest.projectTitle = project.getTitle();
        chatRequest.projectContext = "Project: " + project.getTitle() +
                ". Description: " + (project.getDescription() != null ? project.getDescription() : "");

        ChatResponseDto response = aiClient.chat(chatRequest);

        // Persist conversation
        Conversation conv = conversationRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setProject(project);
                    c.setTitle("AI Chat - " + project.getTitle());
                    return conversationRepository.save(c);
                });

        // Save last user message
        if (chatRequest.messages != null && !chatRequest.messages.isEmpty()) {
            ChatMessageDto lastMsg = chatRequest.messages.get(chatRequest.messages.size() - 1);
            Message userMsg = new Message();
            userMsg.setConversation(conv);
            userMsg.setSenderRole("user");
            userMsg.setContent(lastMsg.content);
            messageRepository.save(userMsg);
        }

        // Save assistant response
        Message assistantMsg = new Message();
        assistantMsg.setConversation(conv);
        assistantMsg.setSenderRole("assistant");
        assistantMsg.setContent(response.reply);
        messageRepository.save(assistantMsg);

        return response;
    }

    private BigDecimal toBigDecimal(Double value) {
        if (value == null) return BigDecimal.ZERO;
        return BigDecimal.valueOf(value);
    }
}
