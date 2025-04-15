# Build stage
FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
RUN deno cache src/main.ts

# Production stage
FROM denoland/deno:latest

# link to the repo
LABEL org.opencontainers.image.source=https://github.com/buildigo/sendgrid-engagement-tracker

WORKDIR /app
COPY --from=builder /app .

HEALTHCHECK --interval=30s --timeout=3s \
  CMD deno eval "try { await fetch('http://localhost:8080/up'); } catch { Deno.exit(1); }"

VOLUME "/data"

EXPOSE 8080

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=/data", "--allow-write=/data", "src/main.ts"]