from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("vLLM_API_KEY")

client = OpenAI(base_url='http://localhost:8000/v1', api_key=api_key)

res = client.chat.completions.create(
    model= 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    messages=[
        {'role': 'system', 'content': 'you are a helpful assistant'},
        {'role': 'user', 'content': 'Summarize the idea of Docker in simple words.'},
    ]
)

print(res.choices[0].message.content)