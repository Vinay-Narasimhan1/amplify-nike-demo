import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    // Listen for storage changes across tabs
    const syncCart = (e) => {
      if (e.key === "cart") {
        setCart(JSON.parse(e.newValue || "[]"));
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // Save cart + recalc total
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) {
      localStorage.setItem("lastCartActivity", Date.now().toString());
    }

    const newTotal = cart.reduce((acc, item) => {
      const price = parseFloat(item.finalPrice || item.price || 0);
      const qty = parseInt(item.quantity || 1, 10);
      return acc + price * qty;
    }, 0);

    setTotal(newTotal);
  }, [cart]);

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.productId !== id);
    setCart(updated);
  };

  // Fetch discounts from Lambda
  async function fetchDiscounts() {
    try {
      const res = await fetch(
        "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/prod/abandonedCartRecovery"
      );
      const data = await res.json();
      const discounted = data.discountedCarts || [];

      if (discounted.length > 0) {
        setCart(discounted);
        const msg = discounted
          .map((d) => `${d.name}: ${d.discountApplied}`)
          .join(", ");
        toast.success(`🎉 Discounts applied! ${msg}`);
      }
    } catch (err) {
      console.error("❌ Error fetching discounts:", err);
    }
  }

  // Check abandoned cart (2 mins → discount)
  useEffect(() => {
    const timer = setInterval(() => {
      const lastActivity = localStorage.getItem("lastCartActivity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > 2 * 60 * 1000) {
          console.log("⏰ Abandoned cart detected → applying discounts");
          fetchDiscounts();
        }
      }
    }, 10000); // check every 10s
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">No items in cart</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item, idx) => {
              const price = parseFloat(item.finalPrice || item.price || 0);
              const qty = parseInt(item.quantity || 1, 10);
              const subtotal = price * qty;

              return (
                <div
                  key={idx}
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
                      <p className="text-gray-600">Qty: {qty}</p>
                      {item.discountApplied && (
                        <p className="text-green-600 text-sm">
                          {item.discountApplied}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${subtotal.toFixed(2)}</p>
                    <button
                      className="text-red-500 mt-2"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}
