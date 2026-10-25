import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-[#52525B] mb-2">Thank you for your order</p>
        <p className="text-[#52525B] mb-8">Order Reference: DASH-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        <p className="text-[#52525B] mb-8 max-w-md mx-auto">
          This is a demo order. In a production environment, you would receive a confirmation email and order updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#A855F7] hover:bg-[#9333EA] text-white">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#E5E7EB]">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
