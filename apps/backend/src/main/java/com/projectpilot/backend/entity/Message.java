package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Column(name = "sender_role", nullable = false, length = 50)
    private String senderRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "taxonomy_tag", length = 50)
    private String taxonomyTag = "INFERENCE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    public Message() {}

    public Message(UUID id, Conversation conversation, String senderRole, String content, String taxonomyTag, ZonedDateTime createdAt) {
        this.id = id;
        this.conversation = conversation;
        this.senderRole = senderRole;
        this.content = content;
        this.taxonomyTag = taxonomyTag != null ? taxonomyTag : "INFERENCE";
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTaxonomyTag() { return taxonomyTag; }
    public void setTaxonomyTag(String taxonomyTag) { this.taxonomyTag = taxonomyTag; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}

