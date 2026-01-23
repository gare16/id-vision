import { MqttClient } from "mqtt";
import { z } from "zod";

import { RFIDCheckPayloadSchema } from "@/schema/mqtt-payload";

import { TopicHandler } from "./topic-handler.interface";
import { checkRfidInDatabase } from "../../../lib/services/rfid-check.service";

export class RFIDCheckTopicHandler implements TopicHandler {
  topic = "rfid/check";

  private client: MqttClient | null = null;

  constructor(
    private onMessage?: (data: z.infer<typeof RFIDCheckPayloadSchema>) => void,
  ) {}

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

  private async handleMessage(message: string): Promise<void> {
    try {
      const parsedData = RFIDCheckPayloadSchema.parse(JSON.parse(message));

      // Process the RFID check request
      console.log("RFID Check received:", parsedData);

      // Check if RFID tag exists in the database using server-side service
      const rfidExists = await checkRfidInDatabase(parsedData.rfidTag);

      // Prepare response data based on RFID existence
      const responseData = {
        ...parsedData,
        processedAt: new Date().toISOString(),
        rfidExists: rfidExists.exists,
        status:
          rfidExists.rfidTagRecord?.status === true ? "Active" : "Inactive",
        visitor: rfidExists.rfidTagRecord?.visitor || null,
      };

      // Call the callback if provided
      if (this.onMessage) {
        this.onMessage(responseData);
      }
    } catch (error) {
      console.error("Error processing RFID check message:", error);
    }
  }
}
