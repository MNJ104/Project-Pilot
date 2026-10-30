package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, UUID> {
    List<Feature> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

