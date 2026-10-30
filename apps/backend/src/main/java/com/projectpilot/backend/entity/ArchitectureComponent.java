package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "architecture_components")
public class ArchitectureComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "architecture_id", nullable = false)
    private Architecture architecture;

    @Column(nullable = false)
    private String name;

    @Column(name = "tech_stack", nullable = false)
    private String techStack;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String responsibility;

    @Column(name = "communication_protocol", nullable = false, length = 100)
    private String communicationProtocol;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public ArchitectureComponent() {}

    public ArchitectureComponent(UUID id, Architecture architecture, String name, String techStack, String responsibility, String communicationProtocol, ZonedDateTime createdAt) {
        this.id = id;
        this.architecture = architecture;
        this.name = name;
        this.techStack = techStack;
        this.responsibility = responsibility;
        this.communicationProtocol = communicationProtocol;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Architecture getArchitecture() { return architecture; }
    public void setArchitecture(Architecture architecture) { this.architecture = architecture; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getResponsibility() { return responsibility; }
    public void setResponsibility(String responsibility) { this.responsibility = responsibility; }

    public String getCommunicationProtocol() { return communicationProtocol; }
    public void setCommunicationProtocol(String communicationProtocol) { this.communicationProtocol = communicationProtocol; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

