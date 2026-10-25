import { expect, test } from "@playwright/test";

test("shopper searches, adds to cart and completes the demo checkout", async ({
  page,
}) => {
  await page.goto("/");

  const search = page
    .getByRole("searchbox", { name: /search products by name/i })
    .first();
  await search.fill("sony");
  await search.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=sony/);
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();

  await page
    .getByRole("link", { name: /Sony WH-1000XM5 Wireless Headphones/ })
    .first()
    .click();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sony WH-1000XM5 Wireless Headphones",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText(/Added 1 × Sony WH-1000XM5/)).toBeVisible();

  await page.getByRole("link", { name: "View cart" }).click();
  await expect(page.getByRole("heading", { name: "Shopping cart" })).toBeVisible();
  await expect(page.getByText("Subtotal (1 item)")).toBeVisible();
  await expect(page.getByText("R6,999.00").first()).toBeVisible();

  await page
    .getByRole("button", { name: /Increase quantity of Sony WH-1000XM5/ })
    .click();
  await expect(page.getByText("Subtotal (2 items)")).toBeVisible();
  await expect(page.getByText("R13,998.00").first()).toBeVisible();

  await page.getByRole("link", { name: "Continue to demo checkout" }).click();
  await expect(page.getByRole("heading", { name: "Demo checkout" })).toBeVisible();
  await expect(page.getByText("Not configured").first()).toBeVisible();

  await page.getByLabel("Email address").fill("shopper@example.co.za");
  await page.getByLabel("First name").fill("Thandi");
  await page.getByLabel("Last name").fill("Mokoena");
  await page.getByLabel("Street address").fill("12 Loop Street");
  await page.getByLabel("City or town").fill("Cape Town");
  await page.getByLabel("Province").selectOption("Western Cape");
  await page.getByLabel("Postal code").fill("8001");
  await page.getByLabel("Phone number").fill("082 123 4567");

  await page.getByRole("button", { name: "Place demo order" }).click();

  await expect(page).toHaveURL(
    /\/checkout\/success\?ref=DASH-DEMO-[A-Z0-9]{6}/,
    { timeout: 10_000 },
  );
  await expect(
    page.getByRole("heading", { name: "Demo order confirmed" }),
  ).toBeVisible();
  await expect(page.getByText(/Demo reference:/)).toBeVisible();
  await expect(page.getByText(/No payment was charged/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart, empty" })).toBeVisible();
});

test("filters and sorts the catalogue through the URL", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "All products" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("6 products");

  // The checkbox is driven by the URL (server-rendered), so use `click` rather
  // than `check`: Playwright's `check()` asserts the DOM state changes
  // synchronously, while here the new state arrives with the next RSC payload.
  const laptops = page.getByRole("checkbox", { name: "Laptops & Computers" });
  await laptops.click();
  await expect(page).toHaveURL(/category=laptops-computers/);
  await expect(laptops).toBeChecked();
  await expect(page.getByRole("status")).toContainText("2 products");

  await page.getByLabel("Sort by").selectOption("price-desc");
  await expect(page).toHaveURL(/sort=price-desc/);
  await expect(
    page.getByRole("main").getByRole("listitem").first(),
  ).toContainText("MacBook Pro");

  await page.getByRole("link", { name: "Clear all" }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("status")).toContainText("6 products");
});

test("search empty state and unknown product page are handled", async ({
  page,
}) => {
  await page.goto("/search?q=zzzz");
  await expect(
    page.getByRole("heading", { name: "No products found" }),
  ).toBeVisible();
  await expect(page.getByText(/matches “zzzz”/)).toBeVisible();

  await page.getByRole("link", { name: "Clear search and filters" }).click();
  await expect(page).toHaveURL(/\/search$/);

  const response = await page.goto("/products/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /couldn’t find that page/i }),
  ).toBeVisible();
});

test("checkout is blocked for an empty cart", async ({ page }) => {
  await page.goto("/checkout");

  await expect(
    page.getByRole("heading", { name: "Your cart is empty" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Place demo order" }),
  ).toHaveCount(0);
});
