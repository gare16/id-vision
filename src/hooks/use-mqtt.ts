"use client";

import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

export function useMqttClient(brokerUrl: string, options = {}) {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const client = mqtt.connect(brokerUrl, options);

    clientRef.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to MQTT broker");
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      client.end();
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
      setIsConnected(false);
    });

    return () => {
      client.end();
    };
  }, [brokerUrl]);

  return {
    client: clientRef.current,
    isConnected,
  };
}
