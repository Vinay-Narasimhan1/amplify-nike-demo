// pages/cart.js
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [discountedCart, setDiscountedCart] = useState(cart);

  // ✅ Abandoned cart discount logic
  useEffect(() => {
    if (cart.length === 0) return;

    // For testing → trigger after 2 minutes of inactivity
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/prod/abandonedCartRecovery",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart }),
          }
        );

        const data = await res.json();
        const discounted = data.discountedCarts || [];

        if (discounted.length > 0) {
          setDiscountedCart(discounted);
          toast.success("🎉 Special discounts have been applied to your cart!");
        }
      } catch (err) {
        console.error("❌ Discount fetch failed", err);
      }
    }, 2 * 60 * 1000); // 2 minutes (change later to 24 * 60 * 60 * 1000 for 24h)

    return () => clearTimeout(timer);
  }, [cart]);

  // ✅ Calculate totals from discounted cart
  const total = discountedCart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {discountedCart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-6">
              {discountedCart.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    {item.discountApplied && (
                      <p className="text-green-600 text-sm">
                        {item.discountApplied}
                      </p>
                    )}
                  </div>
                  <p className="font-bold">
                    ${(item.finalPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="ml-4 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-between items-center">
              <h2 className="text-xl font-bold">Total</h2>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>

            <button
              onClick={clearCart}
              className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              Checkout
            </button>
          </>
        )}
      </main>
    </>
  );
}






