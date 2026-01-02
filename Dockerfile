FROM oven/bun:latest AS bun

FROM bun AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun ci

COPY . .
ARG DATABASE_URL NEXT_PUBLIC_STREAMTHING_SERVER_REGION NEXT_PUBLIC_STREAMTHING_SERVER_ID \
JWT_SIGNING_KEY STREAMTHING_SERVER_PASSWORD REDIS_PASSWORD

RUN for var in DATABASE_URL NEXT_PUBLIC_STREAMTHING_SERVER_REGION NEXT_PUBLIC_STREAMTHING_SERVER_ID \
            JWT_SIGNING_KEY STREAMTHING_SERVER_PASSWORD REDIS_PASSWORD; do \
    export $var=$$var; \
done

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
