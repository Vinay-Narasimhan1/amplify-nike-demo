// context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 1) Load from localStorage on mount (normalize id)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    const normalized = saved.map((it) => ({
      ...it,
      id: it.id ?? it.productId,                 // ensure id
      price: Number(it.price ?? 0),              // ensure number
      quantity: Number(it.quantity ?? 1),        // ensure number
    }));
    setCart(normalized);
  }, []);

  // 2) Persist + mark last activity + cross-tab sync
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) {
      localStorage.setItem("lastCartActivity", Date.now().toString());
    }
    const onStorage = (e) => {
      if (e.key === "cart") {
        const next = JSON.parse(e.newValue || "[]");
        setCart(next.map((it) => ({
          ...it,
          id: it.id ?? it.productId,
          price: Number(it.price ?? 0),
          quantity: Number(it.quantity ?? 1),
        })));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [cart]);

  // 3) Cart ops
  const addToCart = (product, qty = 1) => {
    const id = product.id ?? product.productId;
    const price = Number(product.price ?? 0);
    const image = product.image;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        { id, name: product.name, price, quantity: qty, image },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
