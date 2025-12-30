import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export const kv = Redis.fromEnv();
