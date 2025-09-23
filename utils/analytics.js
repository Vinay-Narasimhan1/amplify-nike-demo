// utils/analytics.js
// Sends analytics events to API Gateway → Lambda → S3

const API_URL = "https://pki11dvzfd.execute-api.us-east-2.amazonaws.com/prod";

/**
 * Send an analytics event
 * @param {string} eventName - e.g., "ProductClick", "AddToCart", "CheckoutStarted"
 * @param {object} attributes - custom metadata, e.g., { product: "Air Runner Pro" }
 */
export async function trackEvent(eventName, attributes = {}) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        timestamp: new Date().toISOString(),
        attributes,
      }),
    });

    if (!res.ok) {
      console.error("Analytics failed:", res.status, res.statusText);
    } else {
      console.log("✅ Analytics event sent:", eventName, attributes);
    }
  } catch (err) {
    console.error("Analytics error:", err);
  }
}


