"use client";

import mqtt from "mqtt";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

import { RFIDCheckTopicHandler } from "@/mqtt/topics/rfid-check-topic.handler";
import { RFIDLogsTopicHandler } from "@/mqtt/topics/rfid-logs-topic.handler";
import { MQTTTopicManager } from "@/mqtt/topics/topic-manager";
import { RFIDCheckPayloadSchema } from "@/schema/mqtt-payload";

// Define the raw RFID event payload structure
export const RawRFIDEventSchema = z.object({
  rfidTag: z.string(),
  deviceId: z.string(),
  location: z.string(),
  timestamp: z.string(),
});

export type RawRFIDEvent = z.infer<typeof RawRFIDEventSchema>;

type MQTTContextType = {
  client: mqtt.MqttClient | null;
  messages: z.infer<typeof RFIDCheckPayloadSchema> | undefined; // Store processed RFID events
  lastRFIDEvent: RawRFIDEvent | null; // Latest raw RFID event for display
  addToCache: (event: RawRFIDEvent) => void; // Method to add event to cache
  clearLastEvent: () => void; // Method to clear the last event
  topicManager: MQTTTopicManager | null; // Manager for topic handlers
};

const MQTTContext = createContext<MQTTContextType>({
  client: null,
  messages: {
    location: "",
    rfidTag: "",
    processedAt: new Date().toISOString(),
    rfidExists: false,
    status: "",
    visitor: null,
  },
  lastRFIDEvent: null,
  addToCache: () => {},
  clearLastEvent: () => {},
  topicManager: null,
});

export const MQTTProvider = ({ children }: { children: React.ReactNode }) => {
  const websocketUrl =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8083/mqtt";
  const [messages, setMessages] =
    useState<z.infer<typeof RFIDCheckPayloadSchema>>();
  const [lastRFIDEvent, setLastRFIDEvent] = useState<RawRFIDEvent | null>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const topicManagerRef = useRef<MQTTTopicManager | null>(null);

  // Temporary cache/storage for RFID events (in-memory for now, could be replaced with Redis in production)
  const rfidEventCache = useRef<RawRFIDEvent[]>([]);

  useEffect(() => {
    const client = mqtt.connect(websocketUrl);
    clientRef.current = client;

    // Initialize topic manager and register handlers
    const topicManager = new MQTTTopicManager(client);
    topicManagerRef.current = topicManager;

    // Register RFID check topic handler
    const rfidCheckHandler = new RFIDCheckTopicHandler((data) => {
      console.log("RFID check handler received data:", data);
      setMessages(data);

      // Convert to raw event format for caching
      const rawEvent: RawRFIDEvent = {
        rfidTag: data.rfidTag,
        deviceId: "gateway", // Could be enhanced to include actual device ID
        location: data.location,
        timestamp: new Date().toISOString(), // Current time as we don't have original timestamp
      };

      // Store in temporary cache
      addToCache(rawEvent);
      setLastRFIDEvent(rawEvent);
    });

    // Register RFID logs topic handler
    const rfidLogsHandler = new RFIDLogsTopicHandler((log) => {
      console.log("RFID logs handler created log:", log);
      // Optionally update UI when a log is created
    });

    topicManager.registerHandler(rfidCheckHandler);
    topicManager.registerHandler(rfidLogsHandler);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("message", async (_topic, message) => {
      // Existing message handling for backward compatibility
      // This handles the legacy "rfid/uid" topic
      if (_topic === "rfid/uid") {
        try {
          const parsed: z.infer<typeof RFIDCheckPayloadSchema> = JSON.parse(
            message.toString(),
          );

          console.log("Received RFID payload:", parsed);

          // Convert to raw event format for caching
          const rawEvent: RawRFIDEvent = {
            rfidTag: parsed.rfidTag,
            deviceId: "gateway", // Could be enhanced to include actual device ID
            location: parsed.location,
            timestamp: new Date().toISOString(), // Current time as we don't have original timestamp
          };

          // Store in temporary cache
          addToCache(rawEvent);

          // Update the last raw event for display
          setLastRFIDEvent(rawEvent);

          setMessages(parsed);
        } catch (error) {
          console.error("Invalid message:", error);
        }
      }
    });

    return () => {
      // Cleanup topic handlers
      if (topicManagerRef.current) {
        topicManagerRef.current.unregisterAll();
      }
      client.end();
    };
  }, [websocketUrl]);

  // Method to add event to cache
  const addToCache = (event: RawRFIDEvent) => {
    // In a real implementation, this could store in Redis or other persistent cache
    // For now, using in-memory cache with a simple limit
    rfidEventCache.current = [...rfidEventCache.current.slice(-99), event]; // Keep last 100 events
  };

  // Method to clear the last event
  const clearLastEvent = () => {
    setLastRFIDEvent(null);
  };

  return (
    <MQTTContext.Provider
      value={{
        client: clientRef.current,
        messages,
        lastRFIDEvent,
        addToCache,
        clearLastEvent,
        topicManager: topicManagerRef.current,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => useContext(MQTTContext);
