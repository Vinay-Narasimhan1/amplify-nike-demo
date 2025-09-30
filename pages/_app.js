// pages/_app.js
import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";
import ChatWidget from "../components/ChatWidget";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <ChatWidget />
    </CartProvider>
  );
}

