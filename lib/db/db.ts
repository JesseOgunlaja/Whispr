import { drizzle } from "drizzle-orm/node-postgres";
import ioredis from "ioredis";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export const redis = new ioredis({
    host: "redis",
    port: 6379,
    password: env.REDIS_PASSWORD,
});
