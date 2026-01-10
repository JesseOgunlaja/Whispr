import { deleteExpiredRooms } from "@/lib/db/dal";

let initialized = false;
export async function startRoomCleanup() {
    if (initialized) return;

    initialized = true;
    setInterval(async () => {
        try {
            await deleteExpiredRooms();
        } catch (error) {
            console.error(error);
        }
    }, 60 * 1000);
}
