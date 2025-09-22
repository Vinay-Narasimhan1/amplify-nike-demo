import NavBar from "../components/NavBar";
import Link from "next/link";
import products from "../data/products";

export default function Shop() {
  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10">Shop All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition">
              <Link href={`/product/${p.id}`}>
                <img src={p.image} alt={p.name} className="w-full h-64 object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 text-gray-700">${p.price}</p>
                <Link
                  href={`/product/${p.id}`}
                  className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
