import { usePublicKeys } from "@/app/_components/PublicKeysProvider";
import { BackendError, RoomQueryData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useJoinRoom } from "./useJoinRoom";

export function useRoomSessionController(res: RoomQueryData | undefined) {
    const { mutate: joinRoom, isPending } = useJoinRoom();
    const { encryptionKey, signingKey } = usePublicKeys();
    const router = useRouter();

    useEffect(() => {
        if (!res?.error) return;

        const error = res.error.value as BackendError;
        if (error.type === "auth" || error.type === "ratelimit") {
            if (error.message !== "User not in room SPACE") {
                router.push(`/?error=${error.message}`);
            } else if (!isPending && encryptionKey && signingKey) {
                joinRoom();
            }
        } else {
            router.push(
                "/?error=An unexpected error occurred, please try again."
            );
        }
    }, [res?.error, router, joinRoom, encryptionKey, signingKey, isPending]);
}
