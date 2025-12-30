import {
    loadPrivateEncryptionKey,
    loadPrivateSigningKey,
    loadPublicEncryptionKey,
    loadPublicSigningKey,
} from "./keyStore";
import { generateEncryptionKeys, generateSigningKeys } from "./primitives";
import { extractPublicKey } from "./utils";

export async function getPublicKeys() {
    const signingKey =
        (await loadPublicSigningKey()) ??
        (await extractPublicKey((await generateSigningKeys()).publicKey));
    const encryptionKey =
        (await loadPublicEncryptionKey()) ??
        (await extractPublicKey((await generateEncryptionKeys()).publicKey));

    return { signingKey, encryptionKey };
}

export async function getPrivateEncryptionKey() {
    return (
        (await loadPrivateEncryptionKey()) ??
        (await generateEncryptionKeys()).privateKey
    );
}

export async function getPrivateSigningKey() {
    return (
        (await loadPrivateSigningKey()) ??
        (await generateSigningKeys()).privateKey
    );
}
