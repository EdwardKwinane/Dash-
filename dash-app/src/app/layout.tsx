import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Navbar2 } from "@/components/ui/navbar2";
import { UserPanel } from "@/components/ui/user-panel";
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
        <ClerkProvider>
          <CartProvider>
            <div className="relative z-50">
              <div className="absolute right-4 top-3 lg:right-8">
                <UserPanel />
              </div>
            </div>
            <Navbar2 />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}