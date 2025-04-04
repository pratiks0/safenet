# Use a lightweight Python image
FROM python:3.10-slim

# Environment variables to avoid .pyc files and to enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt first (for Docker layer caching)
COPY requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the project files
COPY . /app

# Expose the port your Flask app uses (5000 by default)
EXPOSE 5000

# Use Gunicorn to run your Flask API
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--timeout", "300"]
