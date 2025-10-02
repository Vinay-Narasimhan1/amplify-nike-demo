// utils/chatApi.js
export async function sendChat(message, sessionId = "web-session") {
  try {
    const res = await fetch(
      "https://aubnj7jdsi.execute-api.us-east-2.amazonaws.com/prod/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, sessionId }),
        credentials: "omit" // no cookies, avoids CORS preflight issues
      }
    );

    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json(); // { reply: "...", products: [...] }
  } catch (err) {
    console.error("Chat API error:", err);
    return { error: "Network error. Please try again." };
  }
}
