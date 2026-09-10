package com.projectpilot.backend.dto;

import java.time.ZonedDateTime;
import java.util.Map;

public class ErrorResponse {

    private String type;
    private String title;
    private int status;
    private String detail;
    private String instance;
    private String timestamp = ZonedDateTime.now().toString();
    private Map<String, String> errors;

    public ErrorResponse() {}

    public ErrorResponse(String type, String title, int status, String detail, String instance, String timestamp, Map<String, String> errors) {
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
        this.timestamp = timestamp != null ? timestamp : ZonedDateTime.now().toString();
        this.errors = errors;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public String getInstance() { return instance; }
    public void setInstance(String instance) { this.instance = instance; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public Map<String, String> getErrors() { return errors; }
    public void setErrors(Map<String, String> errors) { this.errors = errors; }

    public static class Builder {
        private String type;
        private String title;
        private int status;
        private String detail;
        private String instance;
        private String timestamp = ZonedDateTime.now().toString();
        private Map<String, String> errors;

        public Builder type(String type) { this.type = type; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder status(int status) { this.status = status; return this; }
        public Builder detail(String detail) { this.detail = detail; return this; }
        public Builder instance(String instance) { this.instance = instance; return this; }
        public Builder timestamp(String timestamp) { this.timestamp = timestamp; return this; }
        public Builder errors(Map<String, String> errors) { this.errors = errors; return this; }

        public ErrorResponse build() {
            return new ErrorResponse(type, title, status, detail, instance, timestamp, errors);
        }
    }
}
