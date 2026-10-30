package com.projectpilot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProjectPilotBackendApplication {

    public static void main(String[] args) {
        // Automatically normalize Render / Railway PostgreSQL connection strings for JDBC
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null && !dbUrl.trim().isEmpty() && !dbUrl.startsWith("jdbc:")) {
            String jdbcUrl;
            if (dbUrl.startsWith("postgres://")) {
                jdbcUrl = "jdbc:postgresql://" + dbUrl.substring("postgres://".length());
            } else if (dbUrl.startsWith("postgresql://")) {
                jdbcUrl = "jdbc:postgresql://" + dbUrl.substring("postgresql://".length());
            } else {
                jdbcUrl = "jdbc:" + dbUrl;
            }
            System.setProperty("spring.datasource.url", jdbcUrl);
        }

        SpringApplication.run(ProjectPilotBackendApplication.class, args);
    }
}
