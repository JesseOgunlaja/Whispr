"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { getPublicKeys } from "@/lib/crypto/keyManager";
import { ChildrenProps } from "@/lib/types";
import { createContext, useEffect, useState } from "react";

interface PublicKeys {
    encryptionKey: string;
    signingKey: string;
}
const PublicKeysContext = createContext<PublicKeys | null>(null);
export const usePublicKeys = () => useStrictContext(PublicKeysContext);

export default function PublicKeysProvider({ children }: ChildrenProps) {
    const [publicKeys, setPublicKeys] = useState<PublicKeys>({
        encryptionKey: "",
        signingKey: "",
    });

    useEffect(() => {
        getPublicKeys().then(setPublicKeys);
    }, []);

    return (
        <PublicKeysContext.Provider value={publicKeys}>
            {children}
        </PublicKeysContext.Provider>
    );
}
