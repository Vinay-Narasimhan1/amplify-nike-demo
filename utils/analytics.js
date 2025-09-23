// utils/analytics.js
// Send custom events to Amazon Pinpoint

import { PinpointClient, PutEventsCommand } from "@aws-sdk/client-pinpoint";

// Initialize client
const client = new PinpointClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION, // e.g. "us-east-1"
});

const appId = process.env.NEXT_PUBLIC_PINPOINT_APP_ID; // set in Amplify env vars

/**
 * Track an analytics event
 * @param {string} userId - Unique identifier for user (use Cognito userId later, "anonymous" for now)
 * @param {string} eventName - Event type, e.g. "AddToCart"
 * @param {object} attributes - Extra event details, e.g. { product: "Air Runner Pro", qty: 2 }
 */
export async function trackEvent(userId, eventName, attributes = {}) {
  try {
    const params = {
      ApplicationId: appId,
      EventsRequest: {
        BatchItem: {
          [userId || "anonymous"]: {
            Endpoint: { ChannelType: "EMAIL" }, // Minimal endpoint definition
            Events: {
              [`${Date.now()}`]: {
                EventType: eventName,
                Timestamp: new Date().toISOString(),
                Attributes: attributes,
              },
            },
          },
        },
      },
    };

    const command = new PutEventsCommand(params);
    await client.send(command);

    console.log("✅ Pinpoint Event Sent:", eventName, attributes);
  } catch (err) {
    console.error("❌ Pinpoint Error:", err);
  }
}

