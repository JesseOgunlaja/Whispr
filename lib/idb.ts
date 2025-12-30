import { openDB } from "idb";

const OBJECT_STORES = ["encryption-keys", "signing-keys"];

export async function getDB() {
    return await openDB("crypto-db", 1, {
        upgrade(db) {
            OBJECT_STORES.forEach((store) => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store);
                }
            });
        },
    });
}
