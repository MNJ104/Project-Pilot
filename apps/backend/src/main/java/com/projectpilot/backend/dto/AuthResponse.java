package com.projectpilot.backend.dto;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long expiresInMs;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, Long expiresInMs, UserDto user) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.expiresInMs = expiresInMs;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(Long expiresInMs) { this.expiresInMs = expiresInMs; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private Long expiresInMs;
        private UserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder expiresInMs(Long expiresInMs) { this.expiresInMs = expiresInMs; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, expiresInMs, user);
        }
    }
}
