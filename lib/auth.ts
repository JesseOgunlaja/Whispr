import { SignJWT, jwtVerify } from "jose";
import { USER_IDENTITY_TTL_SECONDS } from "./constants";
import { env } from "./env";

const secret = new TextEncoder().encode(env.JWT_SIGNING_KEY);

export async function signJWT(
    payload: Record<string, unknown>,
    duration = "30d",
) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(duration)
        .sign(secret);
}

export function getTokenCookieConfig(jwt: string) {
    return {
        name: "token",
        value: jwt,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: USER_IDENTITY_TTL_SECONDS,
    } as const;
}

export async function decodeJWT(jwt: string) {
    try {
        const decoded = await jwtVerify(jwt, secret);
        return decoded.payload as Record<string, string>;
    } catch {
        return null;
    }
}
