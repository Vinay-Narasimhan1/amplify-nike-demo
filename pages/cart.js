// pages/cart.js
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [discountedCart, setDiscountedCart] = useState([]);

  // Track last activity timestamp in localStorage
  useEffect(() => {
    const now = Date.now();
    localStorage.setItem("lastCartActivity", now);
  }, [cart]);

  // Fetch discounts from Lambda
  const fetchDiscounts = async () => {
    try {
      const res = await fetch(
        "https://<your-api-id>.execute-api.us-east-2.amazonaws.com/prod/abandonedCartRecovery"
      );
      const data = await res.json();
      const parsed = JSON.parse(data.body);
      setDiscountedCart(parsed.discountedCarts || []);

      if (parsed.discountedCarts?.length > 0) {
        toast.success("🎉 Special discounts have been applied to your cart!");
      }
    } catch (err) {
      console.error("❌ Error fetching discounts:", err);
    }
  };

  // Check for abandoned cart (every 10s)
useEffect(() => {
  const timer = setInterval(() => {
    const lastActivity = localStorage.getItem("lastCartActivity");
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);

      if (elapsed > 2 * 60 * 1000) { // 2 mins for testing
        console.log("⏰ Abandoned cart detected. Fetching discounts...");
        fetchDiscounts();
      }
    }
  }, 10000); // check every 10s
  return () => clearInterval(timer);
}, []);

  const items = discountedCart.length > 0 ? discountedCart : cart;

  const total = items.reduce(
    (sum, item) =>
      sum + (item.finalPrice ? item.finalPrice : item.price) * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × $
                    {item.finalPrice ? item.finalPrice : item.price}
                  </p>
                  {item.discountApplied && (
                    <p className="text-green-600 text-sm">
                      {item.discountApplied}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-between font-bold text-xl mt-6">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={clearCart}
              className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        )}
      </main>
    </>
  );
}
