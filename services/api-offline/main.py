from typing import List, Literal, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from openai import OpenAI

VLLM_BASE_URL = "http://localhost:8000/v1"
VLLM_API_KEY  = "testingvllm"
DEFAULT_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

client = OpenAI(base_url=VLLM_BASE_URL, api_key=VLLM_API_KEY)
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatBody(BaseModel):
    messages: List[Message]
    model: Optional[str] = DEFAULT_MODEL

@app.post("/chat")
def chat(body: ChatBody):
    def stream():
        for chunk in client.chat.completions.create(
            model=body.model or DEFAULT_MODEL,
            messages=[m.model_dump() for m in body.messages],
            stream=True,
        ):
            try:
                delta = chunk.choices[0].delta
                if delta and getattr(delta, "content", None):
                    yield delta.content
            except Exception:
                # ignore non-text chunks (e.g., role/tool calls) or partials
                continue

    return StreamingResponse(stream(), media_type="text/plain")
