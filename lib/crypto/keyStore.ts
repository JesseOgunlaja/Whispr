import { getDB } from "../idb";
import { IDBKey } from "../types";
import { extractPublicKey } from "./utils";

export async function loadPublicSigningKey() {
    const db = await getDB();
    const publicKey = (await db.get("signing-keys", "public")) as IDBKey;

    return publicKey && (await extractPublicKey(publicKey));
}

export async function loadPrivateSigningKey() {
    const db = await getDB();
    const privateKey = (await db.get("signing-keys", "private")) as IDBKey;

    return privateKey;
}

export async function saveSigningKeys(
    publicKey: CryptoKey,
    privateKey: CryptoKey
) {
    const db = await getDB();
    await db.put("signing-keys", publicKey, "public");
    await db.put("signing-keys", privateKey, "private");
}

export async function loadPublicEncryptionKey() {
    const db = await getDB();
    const publicKey = (await db.get("encryption-keys", "public")) as IDBKey;

    return publicKey && (await extractPublicKey(publicKey));
}

export async function loadPrivateEncryptionKey() {
    const db = await getDB();
    const privateKey = (await db.get("encryption-keys", "private")) as IDBKey;

    return privateKey;
}

export async function saveEncryptionKeys(
    publicKey: CryptoKey,
    privateKey: CryptoKey
) {
    const db = await getDB();
    await db.put("encryption-keys", publicKey, "public");
    await db.put("encryption-keys", privateKey, "private");
}
