import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    client: {},
    server: {
        JWT_SIGNING_KEY: z.string(),
        DATABASE_URL: z.string(),
        REDIS_PASSWORD: z.string(),
    },
    runtimeEnv: {
        JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    },
});
