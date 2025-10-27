from openai import OpenAI

client = OpenAI(base_url='http://localhost:8000/v1', api_key='testingvllm')

response = client.chat.completions.create(
    model = 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    messages=[
        {'role': 'system', 'content': 'You are a helpful assistant.'},
        {'role': 'user', 'content': 'Who are you ?'},
    ]
)

print(response.choices[0].message.content)