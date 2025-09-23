// utils/analytics.js
import { PinpointClient, PutEventsCommand } from "@aws-sdk/client-pinpoint";

const client = new PinpointClient({ region: "us-east-1" }); // update if needed
const appId = process.env.NEXT_PUBLIC_PINPOINT_APP_ID;

export async function trackEvent(userId, eventName, attributes = {}) {
  try {
    const params = {
      ApplicationId: appId,
      EventsRequest: {
        BatchItem: {
          [userId || "anonymous"]: {
            Endpoint: { ChannelType: "EMAIL" }, // basic endpoint placeholder
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
    console.log("Event sent to Pinpoint:", eventName, attributes);
  } catch (err) {
    console.error("Pinpoint error:", err);
  }
}
