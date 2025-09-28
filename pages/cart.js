// pages/cart.js
import { useEffect } from "react";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useCart } from "../context/CartContext";

  const ABANDONED_API =
  "https://4ndgo62avnxufyihb45mue6fma0qiyfs.lambda-url.us-east-2.on.aws/";

export default function CartPage() {
  const { cart, setCart, removeFromCart, updateQty } = useCart();

  // Merge discounts into current cart (preserve image/qty)
  async function fetchAndMergeDiscounts() {
    try {
      const res = await fetch(ABANDONED_API);
      if (!res.ok) return;

      const data = await res.json();
      const discounted = Array.isArray(data.discountedCarts)
        ? data.discountedCarts
        : [];

      if (discounted.length === 0) return;

      // Map discounts by productId
      const byId = new Map(
        discounted.map((d) => [
          String(d.productId),
          {
            discountApplied: d.discountApplied || null,
            finalPrice: d.finalPrice != null ? Number(d.finalPrice) : null,
          },
        ])
      );

      // Merge into existing cart (do NOT replace)
      setCart((prev) =>
        prev.map((item) => {
          const d = byId.get(String(item.id));
          if (!d) return item;
          return {
            ...item,
            discountApplied: d.discountApplied,
            // Use per-unit discounted price; keep original price as fallback
            finalPrice: d.finalPrice ?? item.finalPrice ?? item.price,
          };
        })
      );

      const msg = discounted
        .map((d) => `${d.name}: ${d.discountApplied}`)
        .join(", ");
      if (msg) toast.success(`🎉 Discounts applied! ${msg}`);
    } catch (e) {
      console.error("Discount fetch failed:", e);
    }
  }

  // Abandoned-cart check: run every 10s; fire after 2 minutes idle (testing)
  useEffect(() => {
    const t = setInterval(() => {
      const last = localStorage.getItem("lastCartActivity");
      if (!last) return;
      const elapsed = Date.now() - parseInt(last, 10);
      if (elapsed > 10 * 1000) {
        fetchAndMergeDiscounts();
      }
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // Helpers
  const lineTotal = (item) =>
    (item.finalPrice != null ? Number(item.finalPrice) : Number(item.price)) *
    Number(item.quantity);

  const cartTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <>
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        $
                        {(
                          item.finalPrice != null
                            ? Number(item.finalPrice)
                            : Number(item.price)
                        ).toFixed(2)}
                      </p>

                      {/* qty controls */}
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{Number(item.quantity)}</span>
                        <button
                          onClick={() => updateQty(item.id, +1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>

                      {item.discountApplied && (
                        <p className="text-green-600 text-sm mt-1">
                          {item.discountApplied}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ${lineTotal(item).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 mt-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Total: ${cartTotal.toFixed(2)}
              </h2>
              <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
                Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
