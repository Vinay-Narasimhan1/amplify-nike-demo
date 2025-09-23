import NavBar from "../components/NavBar";
import { useCart } from "../context/CartContext";
import { trackEvent } from "../utils/analytics";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (item.qty > 1) {
                        updateQuantity(item.id, item.qty - 1);
                        trackEvent("anonymous", "CartQuantityUpdate", {
                          product: item.name,
                          qty: item.qty - 1,
                        });
                      }
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => {
                      updateQuantity(item.id, item.qty + 1);
                      trackEvent("anonymous", "CartQuantityUpdate", {
                        product: item.name,
                        qty: item.qty + 1,
                      });
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    trackEvent("anonymous", "RemoveFromCart", {
                      product: item.name,
                    });
                  }}
                  className="text-red-500 hover:underline ml-4"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              <button
                onClick={() => {
                  trackEvent("anonymous", "CheckoutStarted", { cart });
                  alert("Checkout coming soon!");
                }}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
