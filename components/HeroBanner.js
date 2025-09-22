import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-black text-white h-[500px] flex items-center justify-center">
      <img
        src="https://via.placeholder.com/1600x500?text=Hero+Banner"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Step Into Style</h1>
        <p className="mb-6 text-lg opacity-90">Discover the latest arrivals</p>
        <Link
          href="/shop"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
