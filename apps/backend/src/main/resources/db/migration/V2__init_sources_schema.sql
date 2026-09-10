-- Flyway Migration V2: Sources and Source Documents Schema

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    url TEXT,
    title VARCHAR(255) NOT NULL,
    content_hash VARCHAR(64),
    extracted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sources_project ON sources(project_id);
CREATE INDEX idx_sources_hash ON sources(content_hash);

CREATE TABLE source_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    raw_content TEXT NOT NULL,
    normalized_content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_source_docs_source ON source_documents(source_id);
