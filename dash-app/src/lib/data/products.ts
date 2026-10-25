import { Product, Category } from "@/types/product";

export const categories: Category[] = [
  { id: "1", name: "Smartphones", slug: "smartphones", description: "Latest flagship and mid-range smartphones" },
  { id: "2", name: "Laptops & Computers", slug: "laptops-computers", description: "Powerful laptops and desktop solutions" },
  { id: "3", name: "Tablets", slug: "tablets", description: "Versatile tablets for work and play" },
  { id: "4", name: "Headphones & Earbuds", slug: "headphones-earbuds", description: "Premium audio for every lifestyle" },
  { id: "5", name: "Speakers & Audio", slug: "speakers-audio", description: "Immersive sound experiences" },
  { id: "6", name: "Monitors & Displays", slug: "monitors-displays", description: "Crystal clear displays for work and gaming" },
  { id: "7", name: "Accessories", slug: "accessories", description: "Keyboards, mice, chargers and more" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 2999900, // R29,999.00
    compareAtPrice: 3299900,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"],
    description: "The most powerful Galaxy ever with advanced AI features, stunning display, and pro-grade camera system.",
    keySellingPoints: ["200MP Camera", "Snapdragon 8 Elite", "6.8\" Dynamic AMOLED 2X", "5000mAh Battery"],
    specifications: {
      "Display": "6.8\" Dynamic AMOLED 2X, 3120 x 1440",
      "Processor": "Snapdragon 8 Elite",
      "RAM": "12GB",
      "Storage": "256GB",
      "Camera": "200MP + 50MP + 50MP + 12MP",
      "Battery": "5000mAh",
      "OS": "Android 15"
    },
    sku: "SMS-GS25U-256",
    stock: 15,
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    warranty: "2 Year Manufacturer Warranty",
    featured: true,
    newArrival: true,
  },
  {
    id: "2",
    slug: "macbook-pro-14-m4",
    name: "MacBook Pro 14\" M4",
    brand: "Apple",
    category: "Laptops & Computers",
    price: 3999900,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
    description: "Supercharged by M4 chip with stunning Liquid Retina XDR display and all-day battery life.",
    keySellingPoints: ["Apple M4 Chip", "14.2\" Liquid Retina XDR", "16GB Unified Memory", "18hrs Battery Life"],
    specifications: {
      "Display": "14.2\" Liquid Retina XDR",
      "Processor": "Apple M4",
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Graphics": "10-core GPU",
      "Battery": "Up to 18 hours",
      "OS": "macOS Sequoia"
    },
    sku: "APP-MBP14-M4-512",
    stock: 8,
    inStock: true,
    rating: 4.9,
    reviewCount: 89,
    warranty: "1 Year Limited Warranty",
    featured: true,
  },
  {
    id: "3",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Headphones & Earbuds",
    price: 699900,
    compareAtPrice: 799900,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
    description: "Industry-leading noise cancellation with exceptional sound quality and all-day comfort.",
    keySellingPoints: ["30hr Battery", "Noise Cancelling", "Hi-Res Audio", "Multipoint Connection"],
    specifications: {
      "Type": "Over-Ear Wireless",
      "Noise Cancellation": "Yes",
      "Battery": "30 hours",
      "Connectivity": "Bluetooth 5.2",
      "Weight": "250g",
      "Driver": "30mm"
    },
    sku: "SON-WH1000XM5-BLK",
    stock: 25,
    inStock: true,
    rating: 4.9,
    reviewCount: 256,
    onSale: true,
  },
  {
    id: "4",
    slug: "dell-xps-13-plus",
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    category: "Laptops & Computers",
    price: 2499900,
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"],
    description: "Ultra-thin and powerful laptop with stunning InfinityEdge display.",
    keySellingPoints: ["Intel Core Ultra", "13.4\" OLED Display", "Ultra-portable", "Long battery life"],
    specifications: {
      "Display": "13.4\" OLED Touch",
      "Processor": "Intel Core Ultra 7",
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Graphics": "Intel Graphics",
      "Weight": "1.17kg"
    },
    sku: "DEL-XPS13P-512",
    stock: 12,
    inStock: true,
    rating: 4.7,
    reviewCount: 67,
    newArrival: true,
  },
  {
    id: "5",
    slug: "ipad-air-m3",
    name: "iPad Air 11\" M3",
    brand: "Apple",
    category: "Tablets",
    price: 1499900,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"],
    description: "Serious performance in a thin and light design, perfect for creativity and productivity.",
    keySellingPoints: ["Apple M3 Chip", "11\" Liquid Retina", "Apple Pencil Pro support", "All-day battery"],
    specifications: {
      "Display": "11\" Liquid Retina",
      "Processor": "Apple M3",
      "RAM": "8GB",
      "Storage": "128GB",
      "Connectivity": "Wi-Fi 6E",
      "OS": "iPadOS 18"
    },
    sku: "APP-IPAIR11-M3-128",
    stock: 20,
    inStock: true,
    rating: 4.8,
    reviewCount: 143,
    featured: true,
  },
  {
    id: "6",
    slug: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Accessories",
    price: 149900,
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"],
    description: "An iconic mouse remastered for ultimate comfort and performance.",
    keySellingPoints: ["8K DPI", "Quiet Clicks", "USB-C Charging", "Multi-device"],
    specifications: {
      "Connectivity": "Bluetooth/Logi Bolt",
      "DPI": "8000",
      "Battery": "70 days",
      "Buttons": "7 custom buttons",
      "Compatibility": "Windows, Mac, Linux"
    },
    sku: "LOG-MXM3S-GRY",
    stock: 50,
    inStock: true,
    rating: 4.9,
    reviewCount: 892,
  },
];

/** Product lookup used by routes, cart restore and tests. */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Category membership is derived from the product record, so listings and
 * category pages can never disagree about where a product belongs. */
export function getProductsInCategory(categoryName: string): Product[] {
  return products.filter((product) => product.category === categoryName);
}
