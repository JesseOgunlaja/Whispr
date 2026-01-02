import { decodeJWT, signJWT } from "@/lib/auth";
import { nanoid } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const token = request.cookies.get("token")?.value;
    let userId = token ? (await decodeJWT(token)).userId : null;

    if (!token || !userId) {
        userId = nanoid();
        const token = await signJWT({ userId });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 60 * 60,
        });
    }

    return response;
}
