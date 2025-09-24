import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const { cart } = useCart();

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
      {/* Logo / Brand */}
      <Link href="/" className="text-2xl font-bold tracking-tight">
        My Store
      </Link>

      {/* Nav Links */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="hover:text-gray-600 transition">
          Home
        </Link>
        <Link href="/shop" className="hover:text-gray-600 transition">
          Shop
        </Link>

        {/* Cart Icon */}
        <Link href="/cart" className="relative">
          <ShoppingBagIcon className="h-6 w-6 hover:text-gray-600 transition" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

