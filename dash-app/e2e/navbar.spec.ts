import { expect, test } from "@playwright/test";

test("shop mega-menu opens, navigates and closes", async ({ page }) => {
  await page.goto("/");

  const shop = page.getByRole("button", { name: "Shop" });
  await expect(shop).toHaveAttribute("aria-expanded", "false");

  await shop.click();
  const panel = page.locator("#shop-menu");
  await expect(panel).toBeVisible();
  await expect(shop).toHaveAttribute("aria-expanded", "true");

  // Real categories with descriptions, plus a featured product card.
  const categoryLinks = panel.locator("a[href^='/categories/']");
  await expect(categoryLinks).toHaveCount(7);
  await expect(panel.locator("a[href^='/products/']")).toBeVisible();
  await expect(
    panel.getByRole("link", { name: "Browse all products →" }),
  ).toBeVisible();

  // Escape closes the menu and returns focus to the Shop trigger.
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(shop).toBeFocused();
});

test("shop mega-menu closes on outside click and on navigation", async ({
  page,
}) => {
  await page.goto("/");

  const shop = page.getByRole("button", { name: "Shop" });
  await shop.click();
  const panel = page.locator("#shop-menu");
  await expect(panel).toBeVisible();

  // Outside click closes without interfering with the page.
  await page.mouse.click(20, 400);
  await expect(panel).toBeHidden();

  // Selecting a destination navigates and the menu stays closed.
  await shop.click();
  await panel.getByRole("link", { name: /^Tablets/ }).click();
  await expect(page).toHaveURL(/\/categories\/tablets$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Tablets/i }),
  ).toBeVisible();
  await expect(shop).toHaveAttribute("aria-expanded", "false");
});

test("support menu reaches the existing support pages", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Support" }).click();
  const panel = page.locator("#support-menu");
  await expect(panel).toBeVisible();

  await expect(
    panel.getByRole("link", { name: "Shipping & delivery" }),
  ).toBeVisible();
  await expect(
    panel.getByRole("link", { name: "Returns & refunds" }),
  ).toBeVisible();
  await expect(panel.getByRole("link", { name: "Warranty" })).toBeVisible();

  await panel.getByRole("link", { name: "Contact us" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(panel).toBeHidden();
});

test("header search navigates to the shared search state", async ({ page }) => {
  await page.goto("/");

  const search = page
    .locator("header")
    .getByRole("searchbox", { name: /search products by name/i });
  await search.fill("sony");
  await search.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=sony/);
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
});

test("cart badge reflects the real cart count", async ({ page }) => {
  await page.goto("/products/sony-wh-1000xm5");

  await expect(page.getByRole("link", { name: "Cart, empty" })).toHaveAttribute(
    "href",
    "/cart",
  );

  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText(/Added 1 × Sony WH-1000XM5/)).toBeVisible();

  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toHaveAttribute(
    "href",
    "/cart",
  );

  // The count is carried into the cart page via the shared context.
  await page.getByRole("link", { name: "Cart, 1 item" }).click();
  await expect(page.getByRole("heading", { name: "Shopping cart" })).toBeVisible();
  await expect(page.getByText("Subtotal (1 item)")).toBeVisible();
});
