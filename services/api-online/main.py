from typing import List, Literal, Optional
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from mistralai import Mistral

# ---- config ----
API_KEY = os.getenv("MISTRAL_API_KEY")  # set in .env
if not API_KEY:
    raise RuntimeError("MISTRAL_API_KEY missing")
DEFAULT_MODEL = "mistral-medium-latest"  # use "mistral-small-latest" for speed

# optional: reuse one client to avoid re-init cost
CLIENT = Mistral(api_key=API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatBody(BaseModel):
    messages: List[Message]
    model: Optional[str] = DEFAULT_MODEL

@app.post("/chat")
def chat(body: ChatBody):
    if not body.messages:
        raise HTTPException(status_code=400, detail="messages[] required")

    def stream():
        # Mistral SDK streaming API
        for event in CLIENT.chat.stream(
            model=body.model or DEFAULT_MODEL,
            messages=[m.model_dump() for m in body.messages],
        ):
            delta = getattr(event, "delta", None)
            if delta:
                # yield plain text chunks
                yield delta
        # final newline so clients finish cleanly
        yield "\n"

    return StreamingResponse(stream(), media_type="text/plain; charset=utf-8")