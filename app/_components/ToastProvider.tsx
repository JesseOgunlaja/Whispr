import { Toaster } from "sonner";

export default function ToastProvider() {
    return (
        <Toaster
            theme="dark"
            richColors
            visibleToasts={3}
            expand
            duration={3000}
            position="top-right"
            closeButton
        />
    );
}
