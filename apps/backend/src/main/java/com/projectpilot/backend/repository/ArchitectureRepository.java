package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Architecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArchitectureRepository extends JpaRepository<Architecture, UUID> {
    List<Architecture> findByProjectId(UUID projectId);
    Optional<Architecture> findFirstByProjectIdOrderByCreatedAtDesc(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

