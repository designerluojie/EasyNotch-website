import { expect, test } from "@playwright/test";

test.describe("PC hero", () => {
  test("matches the first-screen surface and stays within the viewport", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "随手可用的效率入口" })).toBeVisible();
    await expect(page.locator(".hero-pc__cta")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.screenshot({ path: testInfo.outputPath("hero-pc-1440.png"), fullPage: false });

    await page.locator(".hero-pc__cta").click();
    await expect(page.getByRole("status")).toContainText("体验包暂未开放下载");
  });
});

test.describe("Mobile landing page", () => {
  test("uses the mobile navigation and keeps the feature tabs within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const navigation = page.getByRole("navigation", { name: "主导航" });
    await expect(navigation).toBeVisible();
    await expect(navigation).toHaveCSS("width", "343px");
    await expect(page.locator(".hero-pc__nav-logo")).toBeVisible();
    await expect(page.locator(".showcase-section")).toHaveCSS("height", "444px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole("tab", { name: "文件暂存" }).click();
    await expect(page.getByTestId("showcase-notch-panel")).toHaveAttribute("data-active-tab", "file");
  });
});
