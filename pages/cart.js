// pages/cart.js
import { useCart } from "../context/CartContext";
import NavBar from "../components/NavBar";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + (item.finalPrice ?? item.price) * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                  {item.discountApplied && (
                    <p className="text-green-600 text-sm">
                      {item.discountApplied}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  <p className="font-bold">
                    ${((item.finalPrice ?? item.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6 text-xl font-bold">
              Total: ${total.toFixed(2)}
            </div>
          </div>
        )}
      </main>
    </>
  );
}





