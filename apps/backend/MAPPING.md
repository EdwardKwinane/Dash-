# Dash# Catalog → Medusa Mapping (Sprint 01 — documentation only; no migration executed yet)

Source of truth for catalog: `dash-app/src/lib/data/products.ts` (6 products, 7 categories).
This document defines how those records map into Medusa v2 entities for the planned migration.
No data has been migrated or deleted from the frontend.

## Stable identifiers (from existing products.ts)

| Slug (frontend) | Medusa Product ID | SKU (stable) | Brand | Category (name / slug) | Price (ZAR, integer cents) | Stock | Featured | New | Image (verified) |
|---|---|---|---|---|---|---|---|---|---|
| `samsung-galaxy-s25-ultra` | `prod_samsung_s25ultra` (placeholder) | `SMS-GS25U-256` | Samsung | Smartphones / `smartphones` | R29,999.00 → 2999900 | 15 | yes | yes | `/products/samsung-galaxy-s25-ultra.jpg` (CC BY 4.0, verified) |
| `macbook-pro-14-m4` | `prod_appl_macbook_14` | `APL-MBPR14-M4-512` | Apple | Laptops & Computers / `laptops-computers` | R39,999.00 → 3999900 | 8 | yes | no | `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800` (demo, unverified model) |
| `sony-wh-1000xm5` | `prod_sony_wh1000xm5` | `SONY-WH1000XM5-BLK` | Sony | Headphones & Earbuds / `headphones-earbuds` | R9,999.00 → 999900 | 20 | no | no | Unsplash demo |
| `apple-ipad-air-11-m3` | `prod_appl_ipad_air_11` | `APL-IPADAIR11-M3-128` | Apple | Tablets / `tablets` | R14,999.00 → 1499900 | 12 | no | yes | Unsplash demo |
| `logitech-mx-master-3s` | `prod_logi_mxmaster3s` | `LOGI-MXMASTER-3S` | Logitech | Accessories / `accessories` | R1,499.00 → 149900 | 30 | no | no | `/products/logitech-mx-master-3s.jpg` (CC BY 4.0, verified) |
| `dell-xps-13-plus` | `prod_dell_xps13_plus` | `DELL-XPS13-PLUS-9320-1TB` | Dell | Laptops & Computers / `laptops-computers` | R24,999.00 → 2499900 | 5 | yes | no | Unverified / mismatch (current image shows an Apple MacBook) |

## 7 categories (Medusa product_category entities)

| Category slug | Medusa name | Description (existing) | Products |
|---|---|---|---|
| `smartphones` | Smartphones | Latest flagship and mid-range smartphones | 1 |
| `laptops-computers` | Laptops & Computers | Powerful laptops and desktop solutions | 2 |
| `tablets` | Tablets | Versatile tablets for work and play | 1 |
| `headphones-earbuds` | Headphones & Earbuds | Premium audio for every listener | 1 |
| `speakers-audio` | Speakers & Audio | Immersive sound experiences | 0 |
| `monitors-displays` | Monitors & Displays | Crystal clear displays for work and gaming | 0 |
| `accessories` | Accessories | Keyboards, mice, chargers and more | 1 |

## Mapping rules (for future migration)

- **Product IDs**: generate UUIDs from Medusa core (not reused frontend ids); keep frontend slug as `handle`.
- **SKU**: preserved exactly from `products.ts` (used as the inventory tracking key).
- **Prices**: `products.ts` prices are integer cents in ZAR. Medusa `variant.prices` stores integer `amount` per `currency_code`. Use `currency_code: "zar"` for the SA region.
- **Images**: local verified assets (`/products/*.jpg`) reference directly from `dash-app/public/`; remote Unsplash images reference via URL. Medusa supports `thumbnail` + `images[]` fields.
- **Categories**: create via `createProductCategoriesWorkflow`; link via `product.category_ids`.
- **Inventory**: `stock` (integer) maps to `inventory_item.stocked_quantity` via `createInventoryLevelsWorkflow`. No over-selling protection yet (demo checkout; fulfillment not configured).
- **Sales channel / region**: once a South Africa ZAR region exists (`currency_code: "zar"`, country `za`), publish products to that region via `createSalesChannelsWorkflow` + `linkSalesChannelsToStockLocationWorkflow`.
- **Variants / options**: existing products are single-variant (no color/size split); can remain single-variant in Medusa or expand to variants when needed.

## Unresolved / deferred

- **Dell XPS 13 Plus (9320)**: no verified asset (Wikimedia Commons 0 hits for 9320); image remains the mismatched MacBook. Do NOT migrate this product with a false image claim.
- **Delivery / tax / payment providers**: not configured in this sprint (see ADR-014).
- **Clerk / Sanity / PayPal / AWS**: integration boundaries documented below; no providers installed yet (Sprint 01 is foundation only).
