import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Save cart + update total + activity timestamp
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) {
      localStorage.setItem("lastCartActivity", Date.now().toString());
    }

    const newTotal = cart.reduce(
      (acc, item) => acc + (item.finalPrice || item.price) * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.productId !== id);
    setCart(updated);
  };

  // Fetch discounts from abandonedCartRecovery Lambda
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
      console.error("❌ Error fetching abandoned cart discounts:", err);
    }
  }

  // Abandoned cart detection (2 min for testing)
  useEffect(() => {
    const timer = setInterval(() => {
      const lastActivity = localStorage.getItem("lastCartActivity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);

        if (elapsed > 2 * 60 * 1000) {
          console.log("⏰ Abandoned cart detected. Fetching discounts...");
          fetchDiscounts();
        }
      }
    }, 10000); // check every 10s
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <h3>{item.name}</h3>
              <p>
                Qty: {item.quantity} — $
                {((item.finalPrice || item.price) * item.quantity).toFixed(2)}
              </p>
              {item.discountApplied && (
                <p style={{ color: "green" }}>
                  Discount: {item.discountApplied}
                </p>
              )}
              <button onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          ))}
          <h2>Total: ${total.toFixed(2)}</h2>
        </>
      )}
    </div>
  );
}
