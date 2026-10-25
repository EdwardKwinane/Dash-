import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB] mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/logo.jpg"
              alt="Dash#"
              width={120}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-[#52525B] max-w-md">
              South Africa&apos;s premium AI-powered multi-brand electronics retailer. 
              Quality products, competitive prices, and exceptional service.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#0A0A0A] mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-[#52525B] hover:text-[#A855F7]">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-[#52525B] hover:text-[#A855F7]">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="text-[#52525B] hover:text-[#A855F7]">Returns & Refunds</Link></li>
              <li><Link href="/warranty" className="text-[#52525B] hover:text-[#A855F7]">Warranty</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#0A0A0A] mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[#52525B] hover:text-[#A855F7]">About Us</Link></li>
              <li><Link href="/privacy" className="text-[#52525B] hover:text-[#A855F7]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#52525B] hover:text-[#A855F7]">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#E5E7EB] mt-8 pt-8 text-center text-[#52525B]">
          <p>&copy; {year} Dash#. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
