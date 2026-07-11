import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-420", width: 420, height: 900 },
];

for (const viewport of viewports) {
  test(`${viewport.name} stays within the viewport and switches AI Chat`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => undefined },
      });
    });
    await page.goto("/");

    await expect(page.getByRole("tab", { name: "音乐" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "AI Chat" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole("tab", { name: "AI Chat" }).click();
    const notch = page.locator('[data-testid="notch-chrome"]');
    await expect(notch).toBeVisible();
    await expect.poll(async () => notch.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(200);

    if (viewport.name === "desktop" || viewport.name === "mobile-375") {
      await page.screenshot({ path: testInfo.outputPath(`${viewport.name}.png`), fullPage: false });
    }
  });
}

test("copying the contact email shows a toast", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "easynotch@163.com" }).click();
  await expect(page.getByRole("status")).toContainText("邮箱复制成功");
});

