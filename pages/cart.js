// pages/cart.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useCart } from "../context/CartContext";

// --- Recovery Lambda URL (replace with yours if different) ---
const ABANDONED_API =
  "https://4ndgo62avnxufyihb45mue6fma0qiyfs.lambda-url.us-east-2.on.aws/";

export default function CartPage() {
  const { cart, setCart, removeFromCart, updateQty } = useCart();
  const [checking, setChecking] = useState(false);

  // --- record user activity (mouse / keyboard / cart actions) ---
  const recordActivity = () => {
    localStorage.setItem("lastCartActivity", Date.now().toString());
  };

  // --- main effect: attach listeners + start polling ---
  useEffect(() => {
    recordActivity();

    const resetEvents = ["click", "keydown", "mousemove", "scroll"];
    resetEvents.forEach((ev) => window.addEventListener(ev, recordActivity));

    // Poll every 10 s, trigger if idle > 2 min (120 000 ms)
    const poll = setInterval(async () => {
      const last = Number(localStorage.getItem("lastCartActivity"));
      if (!last || checking) return;

      const idleFor = Date.now() - last;
      if (idleFor > 120000) {
        setChecking(true);
        console.log("🕑 Idle > 2 min — fetching recovery discounts...");

        try {
          const res = await fetch(ABANDONED_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          const discounted = Array.isArray(data.discountedCarts)
            ? data.discountedCarts
            : [];

          if (discounted.length) {
            // map by productId
            const byId = new Map(
              discounted.map((d) => [
                String(d.productId),
                {
                  discountApplied: d.discountApplied,
                  finalPrice:
                    d.finalPrice != null ? Number(d.finalPrice) : null,
                },
              ])
            );

            setCart((prev) =>
              prev.map((item) => {
                const d = byId.get(String(item.id));
                if (!d) return item;
                return {
                  ...item,
                  discountApplied: d.discountApplied,
                  finalPrice: d.finalPrice ?? item.price,
                };
              })
            );

            const msg = discounted
              .map((d) => `${d.name}: ${d.discountApplied}`)
              .join(", ");
            toast.success(`🎉 Discounts applied! ${msg}`);
          } else {
            toast("Your cart is saved for you 😊");
          }
        } catch (err) {
          console.error("Recovery fetch failed:", err);
        } finally {
          setChecking(false);
          recordActivity(); // reset timer after check
        }
      }
    }, 10000);

    return () => {
      clearInterval(poll);
      resetEvents.forEach((ev) =>
        window.removeEventListener(ev, recordActivity)
      );
    };
  }, [cart, checking]);

  // --- helpers ---
  const lineTotal = (item) =>
    (item.finalPrice != null ? item.finalPrice : item.price) *
    Number(item.quantity);

  const cartTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  // --- UI ---
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
                          item.finalPrice ?? item.price
                        ).toFixed(2)}
                      </p>

                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          onClick={() => {
                            updateQty(item.id, -1);
                            recordActivity();
                          }}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{Number(item.quantity)}</span>
                        <button
                          onClick={() => {
                            updateQty(item.id, +1);
                            recordActivity();
                          }}
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
                      onClick={() => {
                        removeFromCart(item.id);
                        recordActivity();
                      }}
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
              <button
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
                onClick={recordActivity}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
