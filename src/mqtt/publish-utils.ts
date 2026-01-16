import { MqttClient } from "mqtt";

// Define a generic type for MQTT message payloads
type MQTTMessage = Record<string, unknown> | string;

/**
 * Publish an RFID check request to the rfid/check topic
 */
export const publishRFIDCheck = (
  client: MqttClient | null,
  data: MQTTMessage,
): void => {
  if (!client) {
    console.error("MQTT client not available");
    return;
  }

  try {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    client.publish("rfid/check", message);
    console.log("Published to rfid/check:", message);
  } catch (error) {
    console.error("Error publishing to rfid/check:", error);
  }
};

/**
 * Publish an RFID log event to the rfid/logs topic
 */
export const publishRFIDLog = (
  client: MqttClient | null,
  data: MQTTMessage,
): void => {
  if (!client) {
    console.error("MQTT client not available");
    return;
  }

  try {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    client.publish("rfid/logs", message);
    console.log("Published to rfid/logs:", message);
  } catch (error) {
    console.error("Error publishing to rfid/logs:", error);
  }
};

/**
 * Publish to any custom topic
 */
export const publishToTopic = (
  client: MqttClient | null,
  topic: string,
  data: MQTTMessage,
): void => {
  if (!client) {
    console.error("MQTT client not available");
    return;
  }

  try {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    client.publish(topic, message);
    console.log(`Published to ${topic}:`, message);
  } catch (error) {
    console.error(`Error publishing to ${topic}:`, error);
  }
};
