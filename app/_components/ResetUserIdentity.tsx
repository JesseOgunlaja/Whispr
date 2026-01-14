"use client";

import {
    generateEncryptionKeys,
    generateSigningKeys,
} from "@/lib/crypto/primitives";
import { api } from "@/lib/lib";
import styles from "@/styles/home.module.css";
import { useMutation } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserId } from "./UserIdProvider";

export default function ResetUserIdentity() {
    const { setUserId } = useUserId();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { mutate: resetIdentity } = useMutation({
        mutationFn: async () => {
            return await Promise.all([
                generateEncryptionKeys(),
                generateSigningKeys(),
                api.user.reset.post(),
            ]);
        },
        onMutate: () => {
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 1000);
        },
        onSuccess: (res) => {
            router.refresh();
            setUserId(res[2].data!.userId);
        },
    });

    return (
        <button
            onClick={() => resetIdentity()}
            aria-label="Reset identity"
            {...(isRefreshing ? { className: styles.refreshing } : {})}
        >
            <RefreshCw />
        </button>
    );
}
