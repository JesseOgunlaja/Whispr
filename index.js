/* eslint-disable no-console */
import { spawnSync } from "node:child_process";
import { Socket } from "node:net";

async function start() {
    const host = "postgres";
    const port = 5432;

    await new Promise((resolve) => {
        const tryConnect = () => {
            const socket = new Socket();
            socket.on("connect", () => {
                socket.destroy();
                console.log("Postgres is ready!");

                console.log("Running drizzle-kit migration...");
                spawnSync("bunx", ["drizzle-kit", "migrate"], {
                    stdio: "inherit",
                });

                console.log("Starting server...");
                spawnSync("bun", ["run", "server.js"], { stdio: "inherit" });

                resolve();
            });

            socket.on("error", () => {
                console.log("Waiting for Postgres...");
                socket.destroy();
                setTimeout(tryConnect, 1000);
            });

            socket.connect(port, host);
        };

        tryConnect();
    });
}

await start();
