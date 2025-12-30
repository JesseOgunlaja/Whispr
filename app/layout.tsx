import PublicKeysProvider from "@/app/_components/PublicKeysProvider";
import QueryProvider from "@/app/_components/QueryProvider";
import { env } from "@/lib/env";
import { ChildrenProps } from "@/lib/types";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ToastProvider from "./_components/ToastProvider";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Whispr",
    description:
        "An end-to-end encrypted anonymous chat app with self-destructing chats",
    metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
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

export default function RootLayout({ children }: ChildrenProps) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <link rel="icon" href="/favicon.ico" />
                <ToastProvider />
                <Analytics />
                <QueryProvider>
                    <PublicKeysProvider>{children}</PublicKeysProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
