package com.projectpilot.backend.repository;

import com.projectpilot.backend.entity.SourceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SourceDocumentRepository extends JpaRepository<SourceDocument, UUID> {

    Optional<SourceDocument> findBySourceId(UUID sourceId);
}
