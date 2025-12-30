import { getPrivateEncryptionKey } from "./keyManager";
import { toArrayBuffer, toBase64 } from "./utils";

export async function getSharedEncryptionKey(
    rawOtherPublicKey: string,
    roomId: string
) {
    const privateKey = await getPrivateEncryptionKey();

    const otherPublicKey = await crypto.subtle.importKey(
        "raw",
        toArrayBuffer(rawOtherPublicKey),
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        false,
        []
    );

    const rawSharedKey = await crypto.subtle.deriveBits(
        {
            name: "ECDH",
            public: otherPublicKey,
        },
        privateKey,
        256
    );

    const hkdfBasedSharedKey = await crypto.subtle.importKey(
        "raw",
        rawSharedKey,
        "HKDF",
        false,
        ["deriveKey"]
    );

    const sharedChatKey = await crypto.subtle.deriveKey(
        {
            name: "HKDF",
            salt: new TextEncoder().encode(roomId),
            info: new TextEncoder().encode("chat-key"),
            hash: "SHA-256",
        },
        hkdfBasedSharedKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return sharedChatKey;
}

export async function encryptMessage(sharedKey: CryptoKey, message: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(message);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        sharedKey,
        encoded
    );

    return {
        iv: toBase64(iv.buffer),
        ciphertext: toBase64(ciphertext),
    };
}

export async function decryptMessage(
    sharedKey: CryptoKey,
    ciphertextBase64: string,
    ivBase64: string
) {
    const iv = toArrayBuffer(ivBase64);
    const ciphertext = toArrayBuffer(ciphertextBase64);

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        sharedKey,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}
