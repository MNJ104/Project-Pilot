package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.DatabaseDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DatabaseDesignRepository extends JpaRepository<DatabaseDesign, UUID> {
    List<DatabaseDesign> findByProjectId(UUID projectId);
    Optional<DatabaseDesign> findFirstByProjectIdOrderByCreatedAtDesc(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

