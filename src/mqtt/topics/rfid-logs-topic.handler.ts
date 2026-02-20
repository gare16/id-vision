import { MqttClient } from "mqtt";

import { RawRFIDEventSchema } from "@/context/mqtt-context";

import { TopicHandler } from "./topic-handler.interface";

type LogResult = {
  success: boolean;
  data?: { id: string };
  error?: string;
};

export class RFIDLogsTopicHandler implements TopicHandler {
  topic = "rfid/logs";

  private client: MqttClient | null = null;

  // The callback might not be as useful now, but we'll keep it for potential UI updates
  constructor(private onLogProcessed?: (log: LogResult) => void) {}

  initialize(client: MqttClient): void {
    this.client = client;

    client.subscribe(this.topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${this.topic}:`, err);
        return;
      }
      console.log(`Successfully subscribed to ${this.topic}`);
    });

    client.on("message", (topic, message) => {
      if (topic === this.topic) {
        this.handleMessage(message.toString());
      }
    });
  }

  cleanup(): void {
    if (this.client) {
      this.client.unsubscribe(this.topic);
    }
  }

  private async handleMessage(message: string) {
    let validatedData;
    try {
      console.log(`error function this log topic: `);
      const eventData = JSON.parse(message);
      validatedData = RawRFIDEventSchema.parse({
        rfidTag: eventData.rfidTag || eventData.uid || eventData.tag,
        deviceId: eventData.deviceId || "unknown",
        location: eventData.location || "unknown",
      });

      console.log("Forwarding RFID Log event to API:", validatedData);

      const apiResponse = await fetch("/api/log-rfid-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      // Check if the response is OK before parsing JSON
      if (!apiResponse.ok) {
        console.error(`API request failed with status ${apiResponse.status}`);
        // Try to get error text instead of JSON
        const errorText = await apiResponse.text();
        console.error("API Error Response:", errorText);

        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const responseData = await apiResponse.json();

      if (!this.client) return;

      const responseTopic = `${this.topic}/response`;
      const mqttResponse = {
        eventId: validatedData.rfidTag,
        timestamp: new Date().toISOString(),
        ...responseData,
      };

      this.client.publish(responseTopic, JSON.stringify(mqttResponse));
      console.log("Published API response to MQTT:", mqttResponse);

      if (this.onLogProcessed) {
        this.onLogProcessed({
          success: apiResponse.ok,
          data: responseData.logId ? { id: responseData.logId } : undefined,
          error: apiResponse.ok
            ? undefined
            : responseData.message || "API Error",
        });
      }
    } catch (error) {
      console.error("Error processing or forwarding RFID logs message:", error);

      if (this.client) {
        const responseTopic = `${this.topic}/response`;
        const responseData = {
          eventId: validatedData?.rfidTag,
          status: "validation_error",
          error:
            error instanceof Error ? error.message : "Invalid message format",
        };
        this.client.publish(responseTopic, JSON.stringify(responseData));
      }
    }
  }
}
