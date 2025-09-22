import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-20">
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        MyStore
      </Link>
      <div className="space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <Link href="/shop" className="hover:text-gray-600">Shop</Link>
        <Link href="/cart" className="hover:text-gray-600">Cart</Link>
      </div>
    </nav>
  );
}
