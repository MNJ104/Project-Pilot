-- Flyway Migration V1: Initial Auth & Project Schema Foundation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- 2. ROLES TABLE
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Seed System Roles
INSERT INTO roles (id, name) VALUES
    ('00000000-0000-0000-0000-000000000001', 'ADMIN'),
    ('00000000-0000-0000-0000-000000000002', 'PROJECT_MANAGER'),
    ('00000000-0000-0000-0000-000000000003', 'DEVELOPER'),
    ('00000000-0000-0000-0000-000000000004', 'DESIGNER'),
    ('00000000-0000-0000-0000-000000000005', 'TESTER'),
    ('00000000-0000-0000-0000-000000000006', 'CLIENT'),
    ('00000000-0000-0000-0000-000000000007', 'RESEARCHER'),
    ('00000000-0000-0000-0000-000000000008', 'STUDENT')
ON CONFLICT (name) DO NOTHING;

-- 3. USER_ROLES JOIN TABLE
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. PROJECTS TABLE
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PLANNING',
    health_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_active ON projects(id) WHERE deleted_at IS NULL;

-- 5. PROJECT_MEMBERS TABLE
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_project VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
CREATE INDEX idx_pm_project ON project_members(project_id);
CREATE INDEX idx_pm_user ON project_members(user_id);
