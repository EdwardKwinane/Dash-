import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";
import type { ExecArgs } from "@medusajs/framework/types";

/**
 * Dash# catalogue seed — idempotent, safe to rerun.
 * Creates South Africa ZAR region + 7 categories + 6 products.
 * Keeps existing Europe/EUR data untouched.
 */
export default async function seedDashCatalogue({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // ---- 1. South Africa region (idempotent by name) ----
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
    filters: { name: "South Africa" },
  });

  let saRegionId = existingRegions[0]?.id;
  if (!saRegionId) {
    const { result: regionRes } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "South Africa",
            currency_code: "zar",
            countries: ["za"],
            payment_providers: ["pp_system_default"],
            metadata: {
              return_window_days: 30,
              free_returns: false,
              shipping_rate: 0,
              handling_days_min: 0,
              handling_days_max: 0,
              transit_days_min: 2,
              transit_days_max: 5,
            },
          },
        ],
      },
    });
    saRegionId = regionRes[0].id;
    logger.info("Created South Africa (ZAR) region.");
  } else {
    logger.info("South Africa region already exists; using existing.");
  }

  // ---- 2. Categories (idempotent by name) ----
  const categoryNames = [
    "Smartphones",
    "Laptops & Computers",
    "Tablets",
    "Headphones & Earbuds",
    "Speakers & Audio",
    "Monitors & Displays",
    "Accessories",
  ];
  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });
  const catNamesSet = new Set(existingCats.map((c: any) => c.name));

  const missingCats = categoryNames.filter((n) => !catNamesSet.has(n));
  if (missingCats.length > 0) {
    const { result: catRes } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCats.map((name) => ({
          name,
          is_active: true,
        })),
      },
    });
    logger.info(`Created ${catRes.length} Dash# categories: ${missingCats.join(", ")}`);
  } else {
    logger.info("All 7 Dash# categories exist.");
  }

  const { data: allCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });
  const catByName = (name: string) =>
    allCats.find((c: any) => c.name === name)?.id;

  // ---- 3. Products (idempotent by SKU) ----
  // Source data from dash-app/src/lib/data/products.ts (verified 2026-10-25)
  // Prices confirmed as integer ZAR cents; images verified (CC BY 4.0 for S25 Ultra, MX Master 3S).
  const productsSource = [
    {
      title: "Samsung Galaxy S25 Ultra",
      handle: "samsung-galaxy-s25-ultra",
      description: "The most powerful Galaxy ever with advanced AI features, stunning display, and pro-grade camera system.",
      categoryName: "Smartphones",
      sku: "SMS-GS25U-256",
      priceZar: 2999900,
      compareAtPriceZar: 3299900,
      images: [
        { url: "/products/samsung-galaxy-s25-ultra.jpg" },
      ],
      weight: 227,
      stock: 15,
      status: ProductStatus.PUBLISHED,
      featured: true,
      newArrival: true,
    },
    {
      title: 'MacBook Pro 14" M4',
      handle: "macbook-pro-14-m4",
      description: "Supercharged by M4 chip with stunning Liquid Retina XDR display and all-day battery life.",
      categoryName: "Laptops & Computers",
      sku: "APP-MBP14-M4-512",
      priceZar: 3999900,
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" },
      ],
      weight: 1600,
      stock: 8,
      status: ProductStatus.PUBLISHED,
      featured: true,
    },
    {
      title: "Sony WH-1000XM5 Wireless Headphones",
      handle: "sony-wh-1000xm5",
      description: "Industry-leading noise cancellation with exceptional sound quality and all-day comfort.",
      categoryName: "Headphones & Earbuds",
      sku: "SON-WH1000XM5-BLK",
      priceZar: 699900,
      compareAtPriceZar: 799900,
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" },
      ],
      weight: 250,
      stock: 25,
      status: ProductStatus.PUBLISHED,
      onSale: true,
    },
    {
      title: 'iPad Air 11" M3',
      handle: "ipad-air-m3",
      description: "Serious performance in a thin and light design, perfect for creativity and productivity.",
      categoryName: "Tablets",
      sku: "APP-IPAIR11-M3-128",
      priceZar: 1499900,
      images: [
        { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800" },
      ],
      weight: 460,
      stock: 20,
      status: ProductStatus.PUBLISHED,
      newArrival: true,
      featured: true,
    },
    {
      title: "Logitech MX Master 3S",
      handle: "logitech-mx-master-3s",
      description: "An iconic mouse remastered for ultimate comfort and performance.",
      categoryName: "Accessories",
      sku: "LOG-MXM3S-GRY",
      priceZar: 149900,
      images: [
        { url: "/products/logitech-mx-master-3s.jpg" },
      ],
      weight: 141,
      stock: 50,
      status: ProductStatus.PUBLISHED,
    },
    {
      title: "Dell XPS 13 Plus",
      handle: "dell-xps-13-plus",
      description: "Ultra-thin and powerful laptop with stunning InfinityEdge display.",
      categoryName: "Laptops & Computers",
      sku: "DEL-XPS13P-512",
      priceZar: 2499900,
      images: [
        { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800" },
      ],
      weight: 1170,
      stock: 12,
      status: ProductStatus.PUBLISHED,
      newArrival: true,
    },
  ];

  // Check which SKUs already exist (SKU lives on product_variant in v2)
  const { data: existingVariants } = await query.graph({
    entity: "product_variant",
    fields: ["sku", "product_id"],
  });
  const existingSkus = new Set(
    existingVariants.map((v: any) => v.sku).filter(Boolean)
  );

  const missing = productsSource.filter(
    (p) => !existingSkus.has(p.sku)
  );
  if (missing.length === 0) {
    logger.info("All 6 Dash# products already exist; nothing to create.");
  } else {
    const productsInput = missing.map((p) => ({
      title: p.title,
      handle: p.handle,
      description: p.description,
      category_ids: [catByName(p.categoryName)!],
      status: p.status,
      weight: p.weight,
      images: p.images,
      options: [{ title: "Standard", values: ["Default"] }],
      variants: [
        {
          title: p.title,
          sku: p.sku,
          options: { Standard: "Default" },
          prices: [
            {
              amount: p.priceZar,
              currency_code: "zar",
            },
          ],
        },
      ],
      sales_channels: [{ id: existingProducts[0] ? "sc_01M5S9KX9N0ZA7QKK26EC4NZJF" : undefined }], // use default sales channel
    }));

    // Need actual sales channel id from DB; resolve via query
    const { data: scs } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"],
    });
    const defaultScId = scs[0]?.id;

    // Rebuild input with correct sales_channel id
    const finalInput = productsInput.map((prod) => ({
      ...prod,
      sales_channels: defaultScId ? [{ id: defaultScId }] : [],
    }));

    await createProductsWorkflow(container).run({
      input: { products: finalInput as never },
    });
    logger.info(`Created ${missing.length} Dash# products: ${missing.map((p) => p.sku).join(", ")}`);
  }

  // ---- 4. Inventory (demo fixtures — clearly labelled; not real stock) ----
  // After products exist, set inventory levels using seed stock from source.
  const { data: productsWithId } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
  });

  // Map SKU → product id from variant table for inventory fixtures
  const { data: variantIds } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku", "product_id"],
  });
  const skuToProdId = new Map(
    (variantIds as any[]).map((v) => [v.sku, v.product_id])
  );

  for (const p of productsSource) {
    const dbProdId = skuToProdId.get(p.sku) || productsWithId.find(
      (db: any) => db.handle === p.handle
    )?.id;
    if (!dbProdId) continue;
    // Create inventory item + level only if not already present (idempotency simplified)
    // For Sprint 02: document the stock values; full inventory sync deferred.
    logger.info(`Inventory fixture (demo only): ${p.sku} → stock ${p.stock} — must be replaced with verified physical counts before real sales.`);
  }

  logger.info("Dash# catalogue seed complete. Verify via Admin → Products; South Africa region via Settings → Regions.");
}
