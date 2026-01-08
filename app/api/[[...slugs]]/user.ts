import { getTokenCookieConfig, signJWT } from "@/lib/auth";
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
            cookie.token.set(getTokenCookieConfig(token));
        },
        {
            cookie: t.Object({
                token: t.String(),
            }),
        }
    )
    .use(loadUser)
    .get("/rooms", async ({ userId }) => {
        const usersRooms = await getUsersRooms(userId);
        return {
            rooms: usersRooms.map(({ id, messages }) => ({
                id,
                lastUsed: messages.sort(
                    (a, b) => +b.createdAt - +a.createdAt
                )[0]?.createdAt,
            })),
        };
    });
