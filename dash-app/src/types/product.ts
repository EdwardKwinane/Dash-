export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number; // in ZAR (cents as integer for precision)
  compareAtPrice?: number;
  images: string[];
  altText?: string[];
  description: string;
  keySellingPoints: string[];
  specifications: Record<string, string>;
  sku: string;
  stock: number;
  inStock: boolean;
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  warranty?: string;
  featured?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: Record<string, string>;
  price?: number;
  stock: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}
