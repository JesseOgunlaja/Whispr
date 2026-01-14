import { getPrivateSigningKey } from "./keyManager";
import { sign, verify } from "./primitives";
import { toArrayBuffer, toBase64 } from "./utils";

const signatureWindow = 1000;

export async function createSignature(roomId: string) {
    const privateKey = await getPrivateSigningKey();
    const window = Math.floor(Date.now() / signatureWindow).toString();

    const payload = JSON.stringify({ window, roomId });

    const signature = await sign(payload, privateKey);
    return { window, signature: toBase64(signature) };
}

export async function verifySignature(
    signature: string,
    publicKeyBase64: string,
    window: string,
    roomId: string
) {
    const nowWindow = Math.floor(Date.now() / signatureWindow);
    if (Math.abs(nowWindow - Number(window)) > 1) return false;

    const publicKey = await crypto.subtle.importKey(
        "raw",
        toArrayBuffer(publicKeyBase64),
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["verify"]
    );

    const payload = JSON.stringify({ window, roomId });

    return await verify(payload, signature, publicKey);
}
