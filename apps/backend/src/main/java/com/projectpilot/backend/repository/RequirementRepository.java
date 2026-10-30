package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, UUID> {
    List<Requirement> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

