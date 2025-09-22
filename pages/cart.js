import NavBar from "../components/NavBar";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p>
            Your cart is empty. <Link href="/shop" className="text-blue-600">Go shopping</Link>.
          </p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center py-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p>Qty: {item.qty}</p>
                    <p>${item.price * item.qty}</p>
                  </div>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
              <div className="space-x-4">
                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button
  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
  onClick={() => {
    alert("Checkout flow not implemented yet. This is where Stripe/AWS integration will go.");
  }}
>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
