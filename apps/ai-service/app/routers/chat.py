from fastapi import APIRouter, HTTPException
from app.services.chat_assistant import chat
from app.schemas.chat_schema import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai/v1/chat", tags=["AI Chat"])

@router.get("/health")
async def chat_health():
    return {"status": "UP", "service": "chat-assistant"}

@router.post("/message", response_model=ChatResponse)
async def chat_message_endpoint(request: ChatRequest):
    try:
        return chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat assistant failed: {str(e)}")

