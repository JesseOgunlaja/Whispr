import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

const secret = new TextEncoder().encode(env.JWT_SIGNING_KEY);

export async function signJWT(
    payload: Record<string, unknown>,
    duration = "30d"
) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(duration)
        .sign(secret);
}

export async function decodeJWT(jwt: string) {
    const decoded = await jwtVerify(jwt, secret);
    return decoded.payload as Record<string, string>;
}
