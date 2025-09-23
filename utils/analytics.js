// utils/analytics.js
export async function trackEvent(userId, eventName, attributes = {}) {
  const API_URL = "https://pki11dvzfd.execute-api.us-east-2.amazonaws.com/prod/events";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        timestamp: new Date().toISOString(),
        attributes,
      }),
    });

    if (!res.ok) {
      console.error("❌ Failed to send event:", await res.text());
    } else {
      console.log("✅ Event sent:", eventName, attributes);
    }
  } catch (err) {
    console.error("❌ Analytics error:", err);
  }
}

