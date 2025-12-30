import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_BASE_URL: z.string(),
        NEXT_PUBLIC_STREAMTHING_SERVER_REGION: z.string(),
        NEXT_PUBLIC_STREAMTHING_SERVER_ID: z.string(),
    },
    server: {
        JWT_SIGNING_KEY: z.string(),
        DATABASE_URL: z.string(),
        STREAMTHING_SERVER_PASSWORD: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_STREAMTHING_SERVER_REGION:
            process.env.NEXT_PUBLIC_STREAMTHING_SERVER_REGION,
        NEXT_PUBLIC_STREAMTHING_SERVER_ID:
            process.env.NEXT_PUBLIC_STREAMTHING_SERVER_ID,
        JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        STREAMTHING_SERVER_PASSWORD: process.env.STREAMTHING_SERVER_PASSWORD,
    },
});
