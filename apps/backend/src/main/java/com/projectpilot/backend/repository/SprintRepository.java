package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, UUID> {
    List<Sprint> findByProjectIdOrderBySprintNumberAsc(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

