import { useCart } from "../context/CartContext";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

async function fetchDiscounts() {
  try {
    const res = await fetch(
      "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/prod/abandonedCartRecovery",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // no input needed for now
      }
    );

    if (!res.ok) {
      console.error("❌ Failed to fetch discounts:", res.status);
      return [];
    }

    const data = await res.json();

    // Normalize results: ensure numbers are numbers
    return (data.discountedCarts || []).map((d) => ({
      id: Number(d.productId),
      name: d.name,
      discountApplied: d.discountApplied || null,
      finalPrice: d.finalPrice ? Number(d.finalPrice) : null, // might be null if missing
    }));
  } catch (err) {
    console.error("❌ Error fetching discounts:", err);
    return [];
  }
}

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    fetchDiscounts().then((dc) => {
      setDiscounts(dc);
      dc.forEach((d) => {
        if (d.discountApplied) {
          toast.success(
            `${d.discountApplied} applied to ${d.name}! New price per unit: $${d.finalPrice}`
          );
        }
      });
    });
  }, []);

  // Compute final price per item
  const getFinalPrice = (item) => {
    const discount = discounts.find((d) => d.id === item.id);

    if (discount && discount.finalPrice) {
      // finalPrice is per unit → multiply by cart quantity
      return discount.finalPrice * (item.quantity || 1);
    }

    // fallback → original cart price × quantity
    return Number(item.price || 0) * (item.quantity || 1);
  };

  const total = cart.reduce((sum, item) => sum + getFinalPrice(item), 0);

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => {
              const discount = discounts.find((d) => d.id === item.id);
              const final = getFinalPrice(item);

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-500">
                      Qty: {item.quantity || 1}
                      {discount?.discountApplied && (
                        <span className="ml-2 text-green-600 font-bold">
                          ({discount.discountApplied})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-xl font-bold">
                      ${final.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <div className="text-right mt-6">
              <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            </div>
          </div>
        )}
      </main>
    </>
  );
}




