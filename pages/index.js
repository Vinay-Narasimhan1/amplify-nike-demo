import Link from "next/link";
import NavBar from "../components/NavBar";

export default function HomePage() {
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
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Example placeholders — replace with real products */}
          <div className="group relative border rounded-lg overflow-hidden hover:shadow-xl transition">
            <img
              src="/images/runner.jpg"
              alt="Runner Shoes"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Link
                href="/shop"
                className="bg-white text-black px-4 py-2 rounded-full font-semibold"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="group relative border rounded-lg overflow-hidden hover:shadow-xl transition">
            <img
              src="/images/urban.jpg"
              alt="Urban Sneakers"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Link
                href="/shop"
                className="bg-white text-black px-4 py-2 rounded-full font-semibold"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="group relative border rounded-lg overflow-hidden hover:shadow-xl transition">
            <img
              src="/images/trail.jpg"
              alt="Trail Shoes"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Link
                href="/shop"
                className="bg-white text-black px-4 py-2 rounded-full font-semibold"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
