# Build frontend
FROM node:20-bookworm-slim AS frontend-build
WORKDIR /app

COPY fyp-frontend-main/package.json fyp-frontend-main/package-lock.json ./
RUN npm ci

COPY fyp-frontend-main/ ./
RUN npm run build

# Build backend
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# System deps for opencv
RUN apt-get update \
  && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

COPY fyp-frontend-main/backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend + built frontend
COPY fyp-frontend-main/backend/ /app/backend/
COPY --from=frontend-build /app/dist /app/dist

WORKDIR /app/backend

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
