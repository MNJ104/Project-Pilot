package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.TechStackRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TechStackRecommendationRepository extends JpaRepository<TechStackRecommendation, UUID> {
    List<TechStackRecommendation> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

