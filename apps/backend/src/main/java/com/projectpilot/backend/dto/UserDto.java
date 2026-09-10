package com.projectpilot.backend.dto;

import java.util.Set;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private Set<String> roles;
    private String createdAt;

    public UserDto() {}

    public UserDto(UUID id, String email, String fullName, String avatarUrl, Set<String> roles, String createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private UUID id;
        private String email;
        private String fullName;
        private String avatarUrl;
        private Set<String> roles;
        private String createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder roles(Set<String> roles) { this.roles = roles; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public UserDto build() {
            return new UserDto(id, email, fullName, avatarUrl, roles, createdAt);
        }
    }
}
