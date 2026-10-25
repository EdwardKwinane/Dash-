import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile navigation and search work without a desktop menu", async ({
  page,
}) => {
  await page.goto("/");

  const openMenu = page.getByRole("button", { name: "Open menu" });
  await expect(openMenu).toHaveAttribute("aria-expanded", "false");

  await openMenu.click();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");

  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toBeVisible();
  await expect(
    mobileMenu.getByRole("link", { name: "All products" }),
  ).toBeVisible();

  const search = mobileMenu.getByRole("searchbox", {
    name: /search products by name/i,
  });
  await search.fill("ipad");
  await search.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=ipad/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Search results" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("product layout stacks at mobile width without horizontal scrolling", async ({
  page,
}) => {
  await page.goto("/products/samsung-galaxy-s25-ultra");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Samsung Galaxy S25 Ultra",
    }),
  ).toBeVisible();

  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const clientWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
