import { signJWT } from "@/lib/auth";
import { getUsersRooms } from "@/lib/db/dal";
import { nanoid } from "@/lib/lib";
import { Elysia, t } from "elysia";
import { loadUser } from "./auth";

export const users = new Elysia({ prefix: "/user" })
    .post(
        "/reset",
        async ({ cookie }) => {
            const userId = nanoid();
            const token = await signJWT({ userId });
            cookie.token.set({
                value: token,
                httpOnly: true,
                sameSite: "lax",
                secure: true,
                maxAge: 60 * 60,
            });
        },
        {
            cookie: t.Object({
                token: t.String(),
            }),
        }
    )
    .use(loadUser)
    .get("/rooms", async ({ userId }) => {
        return { rooms: await getUsersRooms(userId) };
    });
