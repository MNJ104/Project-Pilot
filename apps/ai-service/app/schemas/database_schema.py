from pydantic import BaseModel, Field
from typing import List, Optional

class DatabaseEntityDto(BaseModel):
    table_name: str = Field(..., description="Normalized table name, e.g., users, orders")
    columns: List[str] = Field(default_factory=list, description="Column names with SQL types")
    primary_key: str = Field(default="id UUID", description="Primary key definition")
    foreign_keys: List[str] = Field(default_factory=list, description="Foreign key relationships")

class DatabaseDesignResult(BaseModel):
    db_type: str = Field(default="PostgreSQL", description="Target database engine")
    mermaid_er_diagram: str = Field(..., description="Valid Mermaid.js ER diagram string starting with erDiagram")
    migration_sql: str = Field(..., description="Production-grade PostgreSQL DDL script with foreign keys and indexes")
    entities: List[DatabaseEntityDto] = Field(default_factory=list, description="Extracted table models")

