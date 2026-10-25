import type { Metadata } from "next";
import "./globals.css";
import { Navbar2 } from "@/components/ui/navbar2";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/cart-context";

export const metadata: Metadata = {
  title: "Dash# | Premium Electronics Retailer",
  description:
    "Dash# - South Africa's multi-brand electronics retailer. Shop smartphones, laptops, headphones and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans antialiased">
        <CartProvider>
          <Navbar2 />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
