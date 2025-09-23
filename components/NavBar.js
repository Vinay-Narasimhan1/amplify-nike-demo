import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-20">
      {/* Left: Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        MyStore
      </Link>

      {/* Middle: Navigation links */}
      <div className="space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <Link href="/shop" className="hover:text-gray-600">Shop</Link>
      </div>

      {/* Right: Cart */}
      <Link href="/cart" className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.5l1.5 9h13.5l1.5-9h1.5M6.75 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
            {itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

