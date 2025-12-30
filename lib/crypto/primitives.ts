import { saveEncryptionKeys, saveSigningKeys } from "./keyStore";
import { toArrayBuffer } from "./utils";

export async function generateSigningKeys() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["sign", "verify"]
    );

    await saveSigningKeys(publicKey, privateKey);
    return { publicKey, privateKey };
}

export async function sign(payload: string, privateKey: CryptoKey) {
    return await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        privateKey,
        new TextEncoder().encode(payload)
    );
}

export async function verify(
    payload: string,
    signature: string,
    publicKey: CryptoKey
) {
    return await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        publicKey,
        toArrayBuffer(signature),
        new TextEncoder().encode(payload)
    );
}

export async function generateEncryptionKeys() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        false,
        ["deriveKey", "deriveBits"]
    );

    await saveEncryptionKeys(publicKey, privateKey);
    return { publicKey, privateKey };
}
