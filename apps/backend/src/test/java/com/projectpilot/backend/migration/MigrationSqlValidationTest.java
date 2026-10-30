package com.projectpilot.backend.migration;

import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class MigrationSqlValidationTest {

    @Test
    public void testAllFlywayMigrationsExecuteSuccessfully() throws Exception {
        // Test in H2 with PostgreSQL compatibility mode
        String h2Url = "jdbc:h2:mem:migration_test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE";
        try (Connection conn = DriverManager.getConnection(h2Url, "sa", "")) {
            try (Statement stmt = conn.createStatement()) {
                // Register compatibility alias for PostgreSQL uuid_generate_v4()
                stmt.execute("CREATE ALIAS IF NOT EXISTS uuid_generate_v4 FOR \"java.util.UUID.randomUUID\"");

                // Execute V1
                String v1Sql = loadMigration("db/migration/V1__init_auth_schema.sql");
                executeScript(stmt, v1Sql);

                // Execute V2
                String v2Sql = loadMigration("db/migration/V2__init_sources_schema.sql");
                executeScript(stmt, v2Sql);

                // Execute V3
                String v3Sql = loadMigration("db/migration/V3__complete_project_artifacts_schema.sql");
                executeScript(stmt, v3Sql);

                // Verify all tables exist in database
                Set<String> tables = new HashSet<>();
                try (ResultSet rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables")) {
                    while (rs.next()) {
                        String name = rs.getString(1).toLowerCase();
                        tables.add(name);
                    }
                }
                System.out.println("Discovered tables in DB: " + tables);

                // Check V1 tables
                assertTrue(tables.contains("users"), "users table should exist in " + tables);
                assertTrue(tables.contains("roles"), "roles table should exist");
                assertTrue(tables.contains("user_roles"), "user_roles table should exist");
                assertTrue(tables.contains("projects"), "projects table should exist");
                assertTrue(tables.contains("project_members"), "project_members table should exist");

                // Check V2 tables
                assertTrue(tables.contains("sources"), "sources table should exist");
                assertTrue(tables.contains("source_documents"), "source_documents table should exist");

                // Check V3 tables
                assertTrue(tables.contains("requirements"), "requirements table should exist");
                assertTrue(tables.contains("features"), "features table should exist");
                assertTrue(tables.contains("architectures"), "architectures table should exist");
                assertTrue(tables.contains("architecture_components"), "architecture_components table should exist");
                assertTrue(tables.contains("database_designs"), "database_designs table should exist");
                assertTrue(tables.contains("api_definitions"), "api_definitions table should exist");
                assertTrue(tables.contains("tech_stack_recommendations"), "tech_stack_recommendations table should exist");
                assertTrue(tables.contains("wireframes"), "wireframes table should exist");
                assertTrue(tables.contains("sprints"), "sprints table should exist");
                assertTrue(tables.contains("tasks"), "tasks table should exist");
                assertTrue(tables.contains("cost_estimates"), "cost_estimates table should exist");
                assertTrue(tables.contains("risks"), "risks table should exist");
                assertTrue(tables.contains("conversations"), "conversations table should exist");
                assertTrue(tables.contains("messages"), "messages table should exist");
            }
        }
    }

    private String loadMigration(String path) throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(path)) {
            assertNotNull(is, "Migration script not found: " + path);
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private void executeScript(Statement stmt, String sql) throws Exception {
        // Strip out line comments
        StringBuilder cleanSql = new StringBuilder();
        for (String line : sql.split("\n")) {
            String trimmed = line.trim();
            if (!trimmed.startsWith("--")) {
                cleanSql.append(line).append("\n");
            }
        }

        // H2 in PostgreSQL mode compatibility adjustments:
        // 1. replace "PRIMARY KEY DEFAULT uuid_generate_v4()" with "DEFAULT uuid_generate_v4() PRIMARY KEY"
        String normalizedSql = cleanSql.toString().replaceAll("(?i)PRIMARY KEY\\s+DEFAULT\\s+uuid_generate_v4\\(\\)", "DEFAULT uuid_generate_v4() PRIMARY KEY");

        String[] statements = normalizedSql.split(";");
        for (String s : statements) {
            String trimmed = s.trim();
            if (trimmed.isEmpty() || trimmed.toUpperCase().startsWith("CREATE EXTENSION")) {
                continue;
            }
            // 2. Strip PostgreSQL partial index WHERE clause for H2
            if (trimmed.toUpperCase().startsWith("CREATE INDEX")) {
                trimmed = trimmed.replaceAll("(?is)\\s+WHERE\\s+.*", "");
            }
            // 3. Strip PostgreSQL ON CONFLICT clause for H2
            trimmed = trimmed.replaceAll("(?is)\\s+ON\\s+CONFLICT\\s+.*", "");

            try {
                stmt.execute(trimmed);
            } catch (Exception e) {
                System.err.println("FAILED STATEMENT: [" + trimmed + "] -> " + e.getMessage());
                throw e;
            }
        }
    }
}
