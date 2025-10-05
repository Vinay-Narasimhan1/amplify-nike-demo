import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-black text-white h-[520px] md:h-[68vh] max-h-[760px] flex items-center justify-center overflow-hidden">
      {/* background image — never crops */}
      <img
        src="/images/hero.jpg"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-contain object-center"
        /* object-contain shows the whole image; letterboxing will be black
           because the section has bg-black */
      />

      {/* readability overlays (kept subtle, won't hide edges) */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Text + CTA */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase mb-6">
          Move With Style
        </h1>
        <p className="text-base md:text-lg opacity-90 mb-8">
          Engineered for performance. Designed for life.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
}
