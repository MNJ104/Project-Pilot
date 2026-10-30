package com.projectpilot.backend.service;

import com.projectpilot.backend.dto.AiServiceDtos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

/**
 * HTTP client for communicating with the FastAPI AI microservice.
 * All calls include timeout handling and graceful error logging.
 */
@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AiServiceClient(RestTemplate restTemplate,
                           @Value("${ai-service.url:http://localhost:8000}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    private <T> T post(String path, AiGenerateRequest body, Class<T> responseType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AiGenerateRequest> entity = new HttpEntity<>(body, headers);
            ResponseEntity<T> response = restTemplate.exchange(
                    baseUrl + path, HttpMethod.POST, entity, responseType);
            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("AI Service unreachable at {}{}: {}", baseUrl, path, e.getMessage());
            throw new RuntimeException("AI Service is currently unavailable. Please try again later.", e);
        } catch (Exception e) {
            log.error("AI Service call failed at {}{}: {}", baseUrl, path, e.getMessage());
            throw new RuntimeException("AI generation failed: " + e.getMessage(), e);
        }
    }

    public ArchitectureResultDto generateArchitecture(String title, String description, String context) {
        return post("/ai/v1/architecture/generate",
                new AiGenerateRequest(title, description, context),
                ArchitectureResultDto.class);
    }

    public DatabaseDesignResultDto generateDatabase(String title, String description, String context) {
        return post("/ai/v1/database/generate",
                new AiGenerateRequest(title, description, context),
                DatabaseDesignResultDto.class);
    }

    public ApiDesignResultDto generateApiDesign(String title, String description, String context) {
        return post("/ai/v1/api-design/generate",
                new AiGenerateRequest(title, description, context),
                ApiDesignResultDto.class);
    }

    public TechStackResultDto generateTechStack(String title, String description, String context) {
        return post("/ai/v1/tech-stack/generate",
                new AiGenerateRequest(title, description, context),
                TechStackResultDto.class);
    }

    public SprintPlanResultDto generateSprints(String title, String description, String context) {
        return post("/ai/v1/sprints/generate",
                new AiGenerateRequest(title, description, context),
                SprintPlanResultDto.class);
    }

    public CostEstimateResultDto generateCostEstimate(String title, String description, String context) {
        return post("/ai/v1/cost-risk/cost/generate",
                new AiGenerateRequest(title, description, context),
                CostEstimateResultDto.class);
    }

    public RiskPredictionResultDto generateRiskPrediction(String title, String description, String context) {
        return post("/ai/v1/cost-risk/risk/generate",
                new AiGenerateRequest(title, description, context),
                RiskPredictionResultDto.class);
    }

    public DocumentationResultDto generateDocumentation(String title, String description, String context) {
        return post("/ai/v1/documentation/generate",
                new AiGenerateRequest(title, description, context),
                DocumentationResultDto.class);
    }

    public ChatResponseDto chat(ChatRequestDto chatRequest) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ChatRequestDto> entity = new HttpEntity<>(chatRequest, headers);
            ResponseEntity<ChatResponseDto> response = restTemplate.exchange(
                    baseUrl + "/ai/v1/chat/message",
                    HttpMethod.POST, entity, ChatResponseDto.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("AI Chat call failed: {}", e.getMessage());
            throw new RuntimeException("Chat assistant unavailable: " + e.getMessage(), e);
        }
    }

    public boolean isHealthy() {
        try {
            restTemplate.getForObject(baseUrl + "/health", Object.class);
            return true;
        } catch (Exception e) {
            log.warn("AI Service health check failed: {}", e.getMessage());
            return false;
        }
    }
}

