// components/ChatWidget.jsx
import { useEffect, useRef, useState } from "react";
import { sendChat } from "../utils/chatApi";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m your shopping assistant. Ask me anything about our products."
    }
  ]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMessages(m => [...m, { role: "user", text }]);

    try {
      const data = await sendChat(text, `web-${getOrSetSession()}`);
      if (data.error) {
        setMessages(m => [...m, { role: "assistant", text: data.error }]);
        return;
      }

      const reply = (data?.reply || "I’m here to help!").trim();
      const products = Array.isArray(data?.products) ? data.products : [];

      // Push chatbot reply with optional products
      setMessages(m => [...m, { role: "assistant", text: reply, products }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg px-5 py-3 text-white bg-black/80 hover:bg-black transition"
        aria-label="Open chat"
      >
        {open ? "✕" : "Chat"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 font-semibold">Shop Assistant</div>

          <div ref={panelRef} className="p-3 space-y-3 overflow-y-auto max-h-96">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  m.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-xl ${
                    m.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>

                {/* Product cards */}
                {m.role === "assistant" && m.products && m.products.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {m.products.slice(0, 4).map(p => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                      >
                        <h4 className="font-medium">{p.name}</h4>
                        <p className="text-sm text-gray-500">{p.category}</p>
                        <p className="text-sm font-semibold">
                          ${p.price.toFixed(2)}
                        </p>
                        <a
                          href={`/product/${p.id}`}
                          className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                        >
                          View details
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="text-xs text-gray-500">Assistant is typing…</div>}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about shoes, prices, categories…"
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/40"
            />
            <button
              onClick={sendMessage}
              disabled={busy || !input.trim()}
              className="rounded-xl px-4 py-2 bg-black text-white text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function getOrSetSession() {
  try {
    const k = "chat-session-id";
    let v = localStorage.getItem(k);
    if (!v) {
      v = Math.random().toString(36).slice(2);
      localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

