-- Flyway Migration V3: Comprehensive Project Artifacts & Generation Schema

-- 1. REQUIREMENTS TABLE
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    req_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    taxonomy_tag VARCHAR(50) DEFAULT 'FACT',
    confidence_score NUMERIC(3,2) DEFAULT 0.95,
    dependencies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_requirements_project ON requirements(project_id);
CREATE INDEX idx_requirements_category ON requirements(category);

-- 2. FEATURES TABLE
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    feature_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    complexity VARCHAR(20) NOT NULL,
    taxonomy_tag VARCHAR(50) DEFAULT 'INFERENCE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_features_project ON features(project_id);

-- 3. ARCHITECTURES TABLE
CREATE TABLE architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    style VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    mermaid_diagram TEXT NOT NULL,
    deployment_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_architectures_project ON architectures(project_id);

-- 4. ARCHITECTURE COMPONENTS TABLE
CREATE TABLE architecture_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    architecture_id UUID NOT NULL REFERENCES architectures(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    responsibility TEXT NOT NULL,
    communication_protocol VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_arch_components_arch ON architecture_components(architecture_id);

-- 5. DATABASE DESIGNS TABLE
CREATE TABLE database_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    db_type VARCHAR(50) NOT NULL DEFAULT 'PostgreSQL',
    mermaid_er_diagram TEXT NOT NULL,
    migration_sql TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_database_designs_project ON database_designs(project_id);

-- 6. API DEFINITIONS TABLE
CREATE TABLE api_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    endpoint_path VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    request_schema TEXT,
    response_schema TEXT,
    auth_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_api_definitions_project ON api_definitions(project_id);

-- 7. TECH STACK RECOMMENDATIONS TABLE
CREATE TABLE tech_stack_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    technology_name VARCHAR(100) NOT NULL,
    justification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tech_stack_project ON tech_stack_recommendations(project_id);

-- 8. WIREFRAMES TABLE
CREATE TABLE wireframes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    page_name VARCHAR(100) NOT NULL,
    layout_description TEXT NOT NULL,
    components_list TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_wireframes_project ON wireframes(project_id);

-- 9. SPRINTS TABLE
CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    goal TEXT,
    sprint_number INT DEFAULT 1,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'PLANNED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sprints_project ON sprints(project_id);

-- 10. TASKS TABLE
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'TODO',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    story_points INT DEFAULT 1,
    assignee_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);

-- 11. COST ESTIMATES TABLE
CREATE TABLE cost_estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_monthly_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    compute_usd NUMERIC(10,2) DEFAULT 0.00,
    database_usd NUMERIC(10,2) DEFAULT 0.00,
    storage_usd NUMERIC(10,2) DEFAULT 0.00,
    ai_inference_usd NUMERIC(10,2) DEFAULT 0.00,
    breakdown_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cost_estimates_project ON cost_estimates(project_id);

-- 12. RISKS TABLE
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    probability INT NOT NULL,
    impact INT NOT NULL,
    severity_score INT NOT NULL,
    mitigation_strategy TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_risks_project ON risks(project_id);

-- 13. CONVERSATIONS TABLE (AI Copilot Chat)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Project Architecture Copilot',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_conversations_project ON conversations(project_id);

-- 14. MESSAGES TABLE
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    taxonomy_tag VARCHAR(50) DEFAULT 'INFERENCE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

