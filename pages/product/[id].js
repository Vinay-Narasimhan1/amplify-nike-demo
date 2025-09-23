import { useState } from "react";
import { useRouter } from "next/router";
import products from "../../data/products";
import NavBar from "../../components/NavBar";
import { useCart } from "../../context/CartContext";
import { trackEvent } from "../../utils/analytics";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);

  if (!product) return <p>Product not found</p>;

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[500px] object-cover rounded-lg shadow"
        />

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl font-semibold mb-6">${product.price}</p>

          {/* Quantity selector */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                  trackEvent("anonymous", "QuantityChange", {
                    product: product.name,
                    qty: qty - 1,
                  });
                }
              }}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span className="text-lg">{qty}</span>
            <button
              onClick={() => {
                setQty(qty + 1);
                trackEvent("anonymous", "QuantityChange", {
                  product: product.name,
                  qty: qty + 1,
                });
              }}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              addToCart(product, qty);
              trackEvent("anonymous", "AddToCart", {
                product: product.name,
                qty,
              });
              alert(`${qty} × ${product.name} added to cart!`);
            }}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </main>
    </>
  );
}


