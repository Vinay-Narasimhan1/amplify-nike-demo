import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // Save cart + update last activity timestamp
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) {
      localStorage.setItem("lastCartActivity", Date.now().toString());
    }
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
      if (!res.ok) {
        console.error("❌ Failed to fetch abandoned cart discounts:", res.status);
        return;
      }
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

  // Abandoned cart detection
  useEffect(() => {
    const timer = setInterval(() => {
      const lastActivity = localStorage.getItem("lastCartActivity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);

        if (elapsed > 2 * 60 * 1000) {
          // 2 mins for testing, later change to 24 * 60 * 60 * 1000
          console.log("⏰ Abandoned cart detected. Fetching discounts...");
          fetchDiscounts();
        }
      }
    }, 10000); // check every 10s
    return () => clearInterval(timer);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>No items in cart.</p>}

      {cart.map((item) => (
        <div key={item.productId} style={{ marginBottom: "1rem" }}>
          <strong>{item.name}</strong> <br />
          Qty: {item.quantity} <br />
          Price: ${(item.finalPrice || item.price).toFixed(2)} <br />
          {item.discountApplied && (
            <span style={{ color: "green" }}>
              Discount: {item.discountApplied}
            </span>
          )}
          <br />
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}

      <h3>Total: ${total.toFixed(2)}</h3>

      {/* Toast container for popups */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
    </div>
  );
}

