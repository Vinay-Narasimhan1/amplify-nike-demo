import products from "../../data/products";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { trackEvent } from "../../utils/analytics"; // ✅ analytics import
import Link from "next/link";

// ✅ Helper to fetch recommendations
async function fetchRecommendations(lastViewed) {
  try {
    const res = await fetch(
      "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/default/getRecommendations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastViewed }),
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch recommendations:", res.status);
      return [];
    }

    const data = await res.json();
    return data.recommendations || [];
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
}

export async function getStaticPaths() {
  return {
    paths: products.map((p) => ({ params: { id: String(p.id) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => String(p.id) === params.id) || null;
  return { props: { product } };
}

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (product?.id) {
      fetchRecommendations(product.id).then(setRecommendations);
    }
  }, [product?.id]);

  if (!product) {
    return <main className="p-8">Product not found.</main>;
  }

  const handleAddToCart = () => {
    addToCart(product, qty);

    // ✅ Analytics event
    trackEvent("AddToCart", {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
    });

    toast.success(`${qty} × ${product.name} added to cart!`);
  };

  return (
    <>
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side: main + alt images */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow transition-transform duration-500 hover:scale-105"
            />
            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {product.images.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${product.name} alt ${i + 1}`}
                    className="w-full h-32 object-cover rounded hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right side: product info */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.category}</p>
            <p className="text-2xl font-semibold mt-4">${product.price}</p>
            <p className="mt-6 text-gray-800">{product.description}</p>

            {/* Quantity selector */}
            <div className="flex items-center mt-6 space-x-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* ✅ Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/product/${rec.id}`}
                  className="block border rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold">{rec.name}</h3>
                  <p className="text-sm text-gray-600">{rec.category}</p>
                  <p className="mt-2 font-bold">${rec.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
