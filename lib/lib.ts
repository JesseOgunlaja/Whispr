import { App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";
import { formatDistanceToNow } from "date-fns";
import { customAlphabet } from "nanoid";
import { toast } from "sonner";

export const api = treaty<App>(
    typeof window !== "undefined" ? window.location.origin : ""
).api;

export function promiseToast(
    promise: Promise<{ message: string }>,
    loadingMessage?: string
) {
    toast.promise(promise, {
        loading: loadingMessage || "Loading...",
        success: (data) => {
            return data.message;
        },
        error: (data) => {
            return data instanceof Error ? data.message : data;
        },
    });
}

export function formatMessageDate(date: Date) {
    return formatDistanceToNow(date, { addSuffix: true });
}

export const nanoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyz",
    15
);

export function formatTTL(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function isLikelyBase64Key(key: string) {
    return (
        typeof key === "string" &&
        key.length >= 80 &&
        key.length <= 100 &&
        /^[A-Za-z0-9+/=]+$/.test(key)
    );
}
