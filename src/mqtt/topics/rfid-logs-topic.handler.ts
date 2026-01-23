import { MqttClient } from "mqtt";

import { RawRFIDEventSchema } from "@/context/mqtt-context";
import { createVisitorLog } from "@/lib/action/create-visitor-log";

import { TopicHandler } from "./topic-handler.interface";
import { checkRfidInDatabase } from "../../../lib/services/rfid-check.service";

// Define the type for the log result
type LogResult = Awaited<ReturnType<typeof createVisitorLog>>;

export class RFIDLogsTopicHandler implements TopicHandler {
  topic = "rfid/logs";

  private client: MqttClient | null = null;

  constructor(private onLogCreated?: (log: LogResult) => void) {}

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
    try {
      // Parse the incoming RFID event
      const eventData = JSON.parse(message);

      // Validate the event data structure
      const validatedData = RawRFIDEventSchema.parse({
        rfidTag: eventData.rfidTag || eventData.uid || eventData.tag,
        deviceId: eventData.deviceId || "unknown",
        location: eventData.location || "unknown",
        timestamp: eventData.timestamp || new Date().toISOString(),
      });

      console.log("RFID Log event received:", validatedData);

      // Automatically create a log entry
      try {
        console.log(`Execute Try CheckRDID in Database.`);
        const dataVisitor = await checkRfidInDatabase(validatedData.rfidTag);
        console.log(`value of data Visitors: `, dataVisitor);
        if (
          dataVisitor.rfidTagRecord?.visitor &&
          dataVisitor.rfidTagRecord.status
        ) {
          const logResult = await createVisitorLog({
            rfidTag: validatedData.rfidTag,
            location: validatedData.location,
            nik: dataVisitor.rfidTagRecord?.visitor?.nik,
            date: new Date(validatedData.timestamp),
          });

          console.log("Visitor log created successfully:", logResult);
          // Publish success response
          if (this.client && logResult.success) {
            const responseTopic = `${this.topic}/response`;
            const responseData = {
              eventId: validatedData.rfidTag,
              status: "RFID_ACTIVE",
              logId: logResult.data?.idLog,
              timestamp: new Date().toISOString(),
            };

            console.log("Success Publish RFID: ", responseData);
            this.client.publish(responseTopic, JSON.stringify(responseData));
          }

          // Call the callback if provided
          if (this.onLogCreated) {
            this.onLogCreated(logResult);
          }
        } else {
          if (this.client && !dataVisitor.rfidTagRecord?.status) {
            // Publish not found response
            const responseTopic = `${this.topic}/response`;
            const responseData = {
              eventId: validatedData.rfidTag,
              status: "RFID_INACTIVE",
            };

            this.client.publish(responseTopic, JSON.stringify(responseData));
            console.log("Success Publish RFID_INACTIVE RFID: ", responseData);
          }
          console.log("Create failed, RFID_INACTIVE");

          return {
            success: false,
            error: "Create failed, RFID_INACTIVE.",
          };
        }
      } catch (logError) {
        console.log(`Execute Catch CheckRDID in Database.`);
        console.error("Error creating visitor log:", logError);

        // Publish error response
        if (this.client) {
          const responseTopic = `${this.topic}/response`;
          const responseData = {
            eventId: validatedData.rfidTag,
            status: "error",
            error:
              logError instanceof Error ? logError.message : "Unknown error",
            timestamp: new Date().toISOString(),
          };

          this.client.publish(responseTopic, JSON.stringify(responseData));
          console.log(`Error Publish RFID: `, responseData);
        }
      }
    } catch (error) {
      console.error("Error processing RFID logs message:", error);

      // Publish validation error response
      if (this.client) {
        const responseTopic = `${this.topic}/response`;
        const responseData = {
          status: "validation_error",
          error:
            error instanceof Error ? error.message : "Invalid message format",
          timestamp: new Date().toISOString(),
        };

        this.client.publish(responseTopic, JSON.stringify(responseData));
      }
    }
  }
}
