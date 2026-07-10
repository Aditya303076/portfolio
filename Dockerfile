# Use a lightweight Python base image
FROM python:3.10-slim

# Set container working directory
WORKDIR /app

# Copy dependency files first to leverage Docker build cache
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project assets to the container
COPY . .

# Expose Port 8000
EXPOSE 8000

# Start the Python RAG backend server
CMD ["python", "server.py"]
