# Build stage
FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
RUN deno cache src/main.ts

# Production stage
FROM denoland/deno:latest

WORKDIR /app
COPY --from=builder /app .

HEALTHCHECK --interval=30s --timeout=3s \
  CMD deno eval "try { await fetch('http://localhost:8000/health'); } catch { Deno.exit(1); }"

VOLUME ["/data"]

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=/data", "--allow-write=/data", "src/main.ts"]