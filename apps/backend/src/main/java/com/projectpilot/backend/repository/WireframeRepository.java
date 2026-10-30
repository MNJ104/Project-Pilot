package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Wireframe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WireframeRepository extends JpaRepository<Wireframe, UUID> {
    List<Wireframe> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}

