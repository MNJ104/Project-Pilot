package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.CostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CostEstimateRepository extends JpaRepository<CostEstimate, UUID> {
    List<CostEstimate> findByProjectId(UUID projectId);
    Optional<CostEstimate> findFirstByProjectIdOrderByCreatedAtDesc(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

