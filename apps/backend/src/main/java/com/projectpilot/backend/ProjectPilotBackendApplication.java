package com.projectpilot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProjectPilotBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectPilotBackendApplication.class, args);
    }
}
