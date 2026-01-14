"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { ChildrenProps } from "@/lib/types";
import { createContext, useState } from "react";

const UserIdContext = createContext<{
    userId: string;
    setUserId: (userId: string) => void;
} | null>(null);

export const useUserId = () => useStrictContext(UserIdContext);

interface PropsType extends ChildrenProps {
    userId: string;
}

export default function UserIdProvider({
    children,
    userId: initialUserId,
}: PropsType) {
    const [userId, setUserId] = useState(initialUserId);

    return (
        <UserIdContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserIdContext.Provider>
    );
}
