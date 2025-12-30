"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function QueryParamHandler() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const info = params.get("info");

        if (error) toast.error(error);
        else if (info) toast.info(info);

        if (error || info) router.replace("/");
    }, [router]);

    return null;
}
