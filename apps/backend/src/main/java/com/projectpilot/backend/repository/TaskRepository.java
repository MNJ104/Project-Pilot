package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectId(UUID projectId);
    List<Task> findBySprintId(UUID sprintId);
    void deleteByProjectId(UUID projectId);
}

