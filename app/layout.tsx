import QueryProvider from "@/app/_components/QueryProvider";
import { getUserIdHeader } from "@/lib/server-lib";
import { ChildrenProps } from "@/lib/types";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ToastProvider from "./_components/ToastProvider";
import UserIdProvider from "./_components/UserIdProvider";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Whispr",
    description:
        "An end-to-end encrypted anonymous chat app with self-destructing chats",
    metadataBase: new URL("https://whispr.jesseogu.dev"),
    authors: [
        {
            name: "Jesse Ogunlaja",
        },
    ],
    openGraph: {
        title: "Whispr",
        description:
            "An end-to-end encrypted anonymous chat app with self-destructing chats",
        images: ["https://whispr.jesseogu.dev/opengraph.png"],
        locale: "en_GB",
    },
    creator: "Jesse Ogunlaja",
};

export default async function RootLayout({ children }: ChildrenProps) {
    const userId = await getUserIdHeader();
    if (!userId) throw new Error("User ID not found");

    return (
        <html lang="en">
            <body className={poppins.className}>
                <link rel="icon" href="/favicon.ico" />
                <ToastProvider />
                <QueryProvider>
                    <UserIdProvider userId={userId}>{children}</UserIdProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
