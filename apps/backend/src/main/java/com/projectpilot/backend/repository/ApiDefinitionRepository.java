package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.ApiDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApiDefinitionRepository extends JpaRepository<ApiDefinition, UUID> {
    List<ApiDefinition> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

