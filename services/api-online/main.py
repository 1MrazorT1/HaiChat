from mistralai import Mistral
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv
import os

mistral_sdk = FastAPI()

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")
model = "mistral-medium-latest"

client = Mistral(api_key=api_key)

mistral_sdk.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@mistral_sdk.get('/')
def init():
    res = client.chat.complete(
        model = model,
        messages = [
            {
                "role" : "user",
                "content" : "Greet me",
            },
        ]
    )
    return (res.choices[0].message.content)

@mistral_sdk.post('/response', response_class=PlainTextResponse)
async def respond(req: Request):
    user_message = (await req.body()).decode("utf-8")
    res = client.chat.complete(
        model = model,
        messages = [
            {
                "role" : "user",
                "content" : user_message,
            },
        ]
    )
    return (res.choices[0].message.content)