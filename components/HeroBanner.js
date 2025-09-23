import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-black text-white h-[600px] flex items-center justify-center">
      {/* Background image */}
      <img
        src="/images/hero.jpg"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text + CTA */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-6">
          Move With Style
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Engineered for performance. Designed for life.
        </p>
        <Link
          href="/shop"
          className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
}
