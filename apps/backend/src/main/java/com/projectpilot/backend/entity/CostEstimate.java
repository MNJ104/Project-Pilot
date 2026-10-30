package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "cost_estimates")
public class CostEstimate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "total_monthly_usd", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalMonthlyUsd = BigDecimal.ZERO;

    @Column(name = "compute_usd", precision = 10, scale = 2)
    private BigDecimal computeUsd = BigDecimal.ZERO;

    @Column(name = "database_usd", precision = 10, scale = 2)
    private BigDecimal databaseUsd = BigDecimal.ZERO;

    @Column(name = "storage_usd", precision = 10, scale = 2)
    private BigDecimal storageUsd = BigDecimal.ZERO;

    @Column(name = "ai_inference_usd", precision = 10, scale = 2)
    private BigDecimal aiInferenceUsd = BigDecimal.ZERO;

    @Column(name = "breakdown_notes", columnDefinition = "TEXT")
    private String breakdownNotes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public CostEstimate() {}

    public CostEstimate(UUID id, Project project, BigDecimal totalMonthlyUsd, BigDecimal computeUsd,
                        BigDecimal databaseUsd, BigDecimal storageUsd, BigDecimal aiInferenceUsd,
                        String breakdownNotes, ZonedDateTime createdAt) {
        this.id = id;
        this.project = project;
        this.totalMonthlyUsd = totalMonthlyUsd != null ? totalMonthlyUsd : BigDecimal.ZERO;
        this.computeUsd = computeUsd != null ? computeUsd : BigDecimal.ZERO;
        this.databaseUsd = databaseUsd != null ? databaseUsd : BigDecimal.ZERO;
        this.storageUsd = storageUsd != null ? storageUsd : BigDecimal.ZERO;
        this.aiInferenceUsd = aiInferenceUsd != null ? aiInferenceUsd : BigDecimal.ZERO;
        this.breakdownNotes = breakdownNotes;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public BigDecimal getTotalMonthlyUsd() { return totalMonthlyUsd; }
    public void setTotalMonthlyUsd(BigDecimal totalMonthlyUsd) { this.totalMonthlyUsd = totalMonthlyUsd; }

    public BigDecimal getComputeUsd() { return computeUsd; }
    public void setComputeUsd(BigDecimal computeUsd) { this.computeUsd = computeUsd; }

    public BigDecimal getDatabaseUsd() { return databaseUsd; }
    public void setDatabaseUsd(BigDecimal databaseUsd) { this.databaseUsd = databaseUsd; }

    public BigDecimal getStorageUsd() { return storageUsd; }
    public void setStorageUsd(BigDecimal storageUsd) { this.storageUsd = storageUsd; }

    public BigDecimal getAiInferenceUsd() { return aiInferenceUsd; }
    public void setAiInferenceUsd(BigDecimal aiInferenceUsd) { this.aiInferenceUsd = aiInferenceUsd; }

    public String getBreakdownNotes() { return breakdownNotes; }
    public void setBreakdownNotes(String breakdownNotes) { this.breakdownNotes = breakdownNotes; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

