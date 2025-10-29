FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["vllm", "serve", "TinyLlama/TinyLlama-1.1B-Chat-v1.0", "--gpu_memory_utilization", "0.7", "--api_key", "testingvllm"]
