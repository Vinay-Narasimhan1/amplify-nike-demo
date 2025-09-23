import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo / Home */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            My Store
          </Link>
          <Link href="/shop" className="text-gray-700 hover:underline">
            Shop
          </Link>
        </div>

        {/* Right: Login + Cart */}
        <div className="flex items-center space-x-6">
          {/* Login placeholder */}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Login feature coming soon!");
            }}
            className="text-gray-700 hover:underline"
          >
            Login
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-gray-700 hover:underline">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-bold rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

