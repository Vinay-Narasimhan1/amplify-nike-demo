// utils/chatApi.js
export async function sendChat(message) {
  try {
    const res = await fetch("https://aubnj7jdsi.execute-api.us-east-2.amazonaws.com/prod/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message }),
      credentials: "omit"   // ✅ IMPORTANT: no cookies, avoids CORS preflight failures
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Chat API error:", err);
    return { error: "Network error. Please try again." };
  }
}
