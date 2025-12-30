import { Context, useContext } from "react";

export function useStrictContext<T>(context: Context<T>) {
    const ctx = useContext(context);
    if (!ctx) throw new Error("Context must be used within correct provider");
    return ctx;
}
