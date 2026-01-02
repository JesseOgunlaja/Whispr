"use client";

import {
    generateEncryptionKeys,
    generateSigningKeys,
} from "@/lib/crypto/primitives";
import { api } from "@/lib/lib";
import styles from "@/styles/home.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetUserIdentity() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { mutate: resetIdentity } = useMutation({
        mutationFn: async () => {
            await Promise.all([
                generateEncryptionKeys(),
                generateSigningKeys(),
                api.user.reset.post(),
            ]);
        },
        onMutate: () => {
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 1000);
        },
        onSuccess: () => {
            router.refresh();
            queryClient.setQueryData(["user"], []);
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
