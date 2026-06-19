import { chromium, expect, test } from "@playwright/test";

const CREATE_ROOM_PATH = "main > div > button:last-child";
const MESSAGE_INPUT_PATH = 'footer > form > input[type="text"]';
const SEND_BUTTON_PATH = 'footer > form > button[type="submit"]';
const CHAT_PATH = "main > ul:has(li > p > span)";
const DESTROY_ROOM_PATH = "header > div:last-child > button";

test.setTimeout(10000);
test("two users send messages and destroy room", async () => {
    const browser = await chromium.launch();

    const browser1 = await browser.newContext();
    const browser2 = await browser.newContext();

    const user1 = await browser1.newPage();
    const user2 = await browser2.newPage();

    await user1.goto("http://localhost:3000");
    await sleep(100);
    await user1.click(CREATE_ROOM_PATH);
    await sleep(500);

    await user2.goto(user1.url());
    await sleep(250);

    await user1.fill(MESSAGE_INPUT_PATH, "user1");
    await user1.click(SEND_BUTTON_PATH);

    await user2.fill(MESSAGE_INPUT_PATH, "user2");
    await user2.click(SEND_BUTTON_PATH);
    await sleep(500);

    await expect(user1.locator(CHAT_PATH)).toContainText("user2");
    await expect(user2.locator(CHAT_PATH)).toContainText("user1");

    await user2.click(DESTROY_ROOM_PATH);
    await sleep(250);

    expect(
        "http://localhost:3000/",
        "http://localhost:3000/?info=Room%20destroyed",
    ).toContain(user1.url());
    expect(user2.url()).toBe("http://localhost:3000/");

    await browser.close();
});

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
