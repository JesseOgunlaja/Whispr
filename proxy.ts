import { decodeJWT, getTokenCookieConfig, signJWT } from "@/lib/auth";
import { nanoid } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const token = request.cookies.get("token")?.value;
    let userId = token && (await decodeJWT(token))?.userId;

    if (!token || !userId) {
        userId = nanoid();
        const token = await signJWT({ userId });
        response.cookies.set(getTokenCookieConfig(token));
    }

    response.headers.set("user-id", userId);
    return response;
}
