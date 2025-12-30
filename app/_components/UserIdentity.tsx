import { headers } from "next/headers";
import ResetUserIdentity from "./ResetUserIdentity";

export default async function UserIdentity() {
    const userId = (await headers()).get("user-id");
    if (!userId) throw new Error("User ID not found");

    return (
        <div>
            anonymous-{userId.slice(0, 5)}
            <ResetUserIdentity />
        </div>
    );
}
