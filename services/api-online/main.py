from mistralai import Mistral
from fastapi import FastAPI

mistral_sdk = FastAPI()

api_key = "ZANTdrtsERSbUZLXvjn9xVtS68kPnJDY"
model = "mistral-medium-latest"

client = Mistral(api_key=api_key)

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

@mistral_sdk.post('/response/{user_message}')
def respond(user_message: str):
    res = client.chat.complete(
        model = model,
        messages = [
            {
                "role" : "user",
                "content" : "Very briefly" + user_message,
            },
        ]
    )
    return (res.choices[0].message.content)