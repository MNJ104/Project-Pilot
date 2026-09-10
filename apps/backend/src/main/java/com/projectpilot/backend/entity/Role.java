package com.projectpilot.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, unique = true, nullable = false)
    private RoleName name;

    public Role() {}

    public Role(UUID id, RoleName name) {
        this.id = id;
        this.name = name;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }

    public static class Builder {
        private UUID id;
        private RoleName name;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder name(RoleName name) { this.name = name; return this; }

        public Role build() {
            return new Role(id, name);
        }
    }
}
