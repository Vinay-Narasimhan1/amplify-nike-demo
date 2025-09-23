import { useState } from "react";
import products from "../data/products";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { trackEvent } from "../utils/analytics"; // ✅ analytics import

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Running", "Lifestyle", "Training", "Trail"];

  const filtered = products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Shop</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              trackEvent("Search", { query: e.target.value }); // ✅ track search
            }}
            className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Category buttons */}
          <div className="flex space-x-3 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  trackEvent("CategorySelected", { category: c }); // ✅ track category
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === c
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            filtered.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                onClick={() =>
                  trackEvent("ProductClick", {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                  }) // ✅ track product click
                }
                className="group relative block border rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Product image */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                    View Product
                  </span>
                </div>

                {/* Product info */}
                <div className="p-4">
                  <h2 className="font-semibold text-lg group-hover:underline">
                    {p.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{p.category}</p>
                  <p className="mt-2 font-bold">${p.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </>
  );
}





