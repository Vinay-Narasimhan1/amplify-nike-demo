import Link from "next/link";
import NavBar from "../components/NavBar";
import products from "../data/products";

/**
 * We'll pick one featured product per category so
 * the image, name, and /product/[id] link always match your data.
 * If your product objects already have the right `image`, we'll use it.
 * Otherwise we fall back to the static /public/images/* files.
 */
const FEATURED_CATEGORIES = [
  { category: "Running",   fallbackImage: "/images/runner.jpg" },
  { category: "Lifestyle", fallbackImage: "/images/urban.jpg" },
  { category: "Trail",     fallbackImage: "/images/trail.jpg" },
];

export default function HomePage() {
  // Build featured list by looking up the first product in each category.
  const featured = FEATURED_CATEGORIES.map(({ category, fallbackImage }) => {
    const p = products.find((prod) => prod.category === category);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.image || fallbackImage,
    };
  }).filter(Boolean);

  return (
    <>
      <NavBar />

      {/* Hero Banner */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white">
        <img
          src="/images/hero.jpg"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Move with Style</h1>
          <p className="text-lg mb-6">Gear up with our latest collection</p>
          <Link
            href="/shop"
            className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <div
              key={p.id}
              className="group relative border rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Link
                  href={`/product/${p.id}`} // ✅ always matches the real product id
                  className="bg-white text-black px-4 py-2 rounded-full font-semibold"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
