FROM oven/bun:alpine AS bun

FROM bun AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN BUN_INSTALL_CACHE=/tmp/bun_cache bun ci && rm -rf /tmp/bun_cache

COPY . .

ENV \
  DATABASE_URL=dummy \
  NEXT_PUBLIC_STREAMTHING_SERVER_REGION=eus \
  NEXT_PUBLIC_STREAMTHING_SERVER_ID=68980918446219891605 \
  JWT_SIGNING_KEY=dummy \
  STREAMTHING_SERVER_PASSWORD=dummy \
  REDIS_PASSWORD=dummy

RUN bun run build

FROM bun AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "run", "server.js"]
