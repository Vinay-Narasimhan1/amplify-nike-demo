// pages/product/[id].js
import products from "../../data/products";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

// --- API endpoint (API Gateway) ---
const RECS_URL =
  "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/prod/getRecommendations";

// Robust recommendations fetcher: tolerates different response shapes
async function fetchRecommendations(lastViewed) {
  try {
    const res = await fetch(RECS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ensure number is sent; some Lambdas rely on numeric parsing
      body: JSON.stringify({ lastViewed: Number(lastViewed) }),
    });

    if (!res.ok) {
      console.error("Recommendations HTTP error:", res.status);
      return [];
    }

    const data = await res.json();

    // Accept any of these shapes:
    // { products: [...] }
    // { recommendations: [...] }
    // { response: { recommendations: [...] } }
    // or even a bare array [...]
    const candidates =
      data?.products ??
      data?.recommendations ??
      data?.response?.recommendations ??
      data;

    if (Array.isArray(candidates)) return candidates.filter(Boolean);
    if (Array.isArray(candidates?.items)) return candidates.items.filter(Boolean);

    console.warn("Unexpected recommendations shape:", data);
    return [];
  } catch (err) {
    console.error("fetchRecommendations failed:", err);
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
    if (!product?.id) return;

    // Fetch recs whenever the product changes
    fetchRecommendations(product.id).then((recs) => {
      setRecommendations(Array.isArray(recs) ? recs : []);
    });
  }, [product?.id]);

  if (!product) {
    return <main className="p-8">Product not found.</main>;
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty} × ${product.name} added to cart!`);
  };

  return (
    <>
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.category}</p>
            <p className="text-2xl font-semibold mt-4">${product.price}</p>
            <p className="mt-6 text-gray-800">{product.description}</p>

            {/* Quantity selector */}
            <div className="flex items-center mt-6 space-x-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 bg-gray-200 rounded"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-lg font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 bg-gray-200 rounded"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="mt-6 bg-black text-white px-6 py-3 rounded"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>

          {recommendations.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <Link
                  key={String(rec.id)}
                  href={`/product/${rec.id}`}
                  className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold">{rec.name}</h3>
                  <p className="text-sm text-gray-600">{rec.category}</p>
                  {"price" in rec && (
                    <p className="mt-2 font-bold">${rec.price}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recommendations at the moment.</p>
          )}
        </section>
      </main>
    </>
  );
}


