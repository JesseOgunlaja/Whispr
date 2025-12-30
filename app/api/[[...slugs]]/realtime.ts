import { env } from "@/lib/env";
import Elysia from "elysia";
import { createToken } from "streamthing";
import { isUserAuthorized } from "./auth";

export const realtime = new Elysia({ prefix: "realtime" })
    .use(isUserAuthorized)
    .get("/token/:roomId", async ({ room }) => {
        const token = await createToken({
            channel: room.id,
            password: env.STREAMTHING_SERVER_PASSWORD,
        });

        return { success: true, token };
    });
