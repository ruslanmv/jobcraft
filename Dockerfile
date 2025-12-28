# Minimal Dockerfile (API only). For UI, build separately or add multi-stage.
FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN pip install -U pip && pip install uv
RUN uv sync

EXPOSE 8000
CMD ["uv", "run", "jobcraft-serve"]
