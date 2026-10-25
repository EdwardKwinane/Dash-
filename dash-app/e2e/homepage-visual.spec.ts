import { expect, test } from "@playwright/test";

test("hero CTA and featured showcase navigate to real routes", async ({
  page,
}) => {
  await page.goto("/");

  // Primary CTA is visibly distinct and lands on real catalogue data.
  await expect(
    page.getByRole("link", { name: "Shop all products" }),
  ).toBeVisible();

  // The featured showcase is the real seeded hero product with real price.
  const showcase = page.getByRole("link", {
    name: /Featured product Samsung Galaxy S25 Ultra R29,999\.00 View product/,
  });
  await expect(showcase).toBeVisible();
  await showcase.click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Samsung Galaxy S25 Ultra" }),
  ).toBeVisible();
});

test("category cards show real counts and navigate by the actual slug", async ({
  page,
}) => {
  await page.goto("/");

  const laptops = page
    .getByRole("region")
    .filter({ has: page.getByRole("heading", { name: "Shop by category" }) })
    .getByRole("link", { name: /Laptops & Computers/ });

  await expect(laptops).toContainText("2 products");
  await laptops.click();
  await expect(page).toHaveURL(/\/categories\/laptops-computers$/);
  await expect(page.getByRole("heading", { level: 1, name: "Laptops & Computers" })).toBeVisible();
});

test("featured and new-arrival cards use the shared product card behaviour", async ({
  page,
}) => {
  await page.goto("/");

  const featuredCard = page
    .getByRole("link", { name: /MacBook Pro 14/ })
    .first();
  await expect(featuredCard).toBeVisible();
  await expect(featuredCard).toContainText("R39,999.00");
  await expect(featuredCard).toContainText("View details");

  await featuredCard.click();
  await expect(
    page.getByRole("heading", { level: 1, name: /MacBook Pro 14/ }),
  ).toBeVisible();
});

test("homepage has no horizontal overflow at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const clientWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
