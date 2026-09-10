package com.projectpilot.backend.controller;

import com.projectpilot.backend.dto.IngestSourceDto;
import com.projectpilot.backend.dto.SourceDetailDto;
import com.projectpilot.backend.dto.SourceResponseDto;
import com.projectpilot.backend.security.UserPrincipal;
import com.projectpilot.backend.service.SourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sources")
@RequiredArgsConstructor
@Tag(name = "Sources", description = "Input content extraction & ingestion endpoints for Chrome Extension & Dashboard")
public class SourceController {

    private final SourceService sourceService;

    @PostMapping
    @Operation(summary = "Ingest captured content source", description = "Persists scraped webpage or repository content sent by Chrome extension or web UI")
    public ResponseEntity<SourceResponseDto> ingestSource(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody IngestSourceDto ingestSourceDto) {
        SourceResponseDto response = sourceService.ingestSource(currentUser.getId(), ingestSourceDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "List project sources", description = "Fetches all input sources associated with a project")
    public ResponseEntity<List<SourceResponseDto>> getSourcesForProject(@PathVariable("projectId") UUID projectId) {
        List<SourceResponseDto> sources = sourceService.getSourcesForProject(projectId);
        return ResponseEntity.ok(sources);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get source details", description = "Fetches source metadata and raw/normalized content text")
    public ResponseEntity<SourceDetailDto> getSourceDetails(@PathVariable("id") UUID id) {
        SourceDetailDto details = sourceService.getSourceDetails(id);
        return ResponseEntity.ok(details);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete source", description = "Removes a captured content source and its raw document")
    public ResponseEntity<Void> deleteSource(@PathVariable("id") UUID id) {
        sourceService.deleteSource(id);
        return ResponseEntity.noContent().build();
    }
}
