from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessageDto(BaseModel):
    role: str = Field(..., description="user or assistant or system")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    messages: List[ChatMessageDto] = Field(..., description="Conversation history")
    project_title: str = Field(..., description="Active project title")
    project_context: Optional[str] = Field("", description="Condensed project artifacts for RAG context")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Assistant response text with markdown support")
    taxonomy_tag: str = Field(default="INFERENCE", description="FACT, INFERENCE, RECOMMENDATION")

