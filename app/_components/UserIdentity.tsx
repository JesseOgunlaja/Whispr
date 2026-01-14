"use client";

import ResetUserIdentity from "./ResetUserIdentity";
import { useUserId } from "./UserIdProvider";

export default function UserIdentity() {
    const { userId } = useUserId();

    return (
        <div>
            anonymous-{userId.slice(0, 5)}
            <ResetUserIdentity />
        </div>
    );
}
