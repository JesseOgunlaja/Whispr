FROM oven/bun:latest AS bun

FROM bun AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun ci

COPY . .

ENV \
  DATABASE_URL=dummy \
  NEXT_PUBLIC_STREAMTHING_SERVER_REGION=eus \
  NEXT_PUBLIC_STREAMTHING_SERVER_ID=68980918446219891605 \
  JWT_SIGNING_KEY=dummy \
  STREAMTHING_SERVER_PASSWORD=dummy

RUN bun run build

FROM bun AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.js /app/drizzle.config.ts ./
COPY --from=builder /app/.drizzle ./.drizzle

RUN rm package.json
RUN bun add drizzle-kit drizzle-orm drizzle-zod

EXPOSE 3000
CMD ["bun", "run", "index.js"]
