"use client";

import { useMqttClient } from "@/hooks/use-mqtt";
import { useEffect, useState } from "react";

type RFIDPayloadType = {
  access: string;
  location: string;
  rfid_tag: string;
};

const MQTTComponent = () => {
  // const { client, isConnected } = useMqttClient("ws://192.168.43.85:8083/mqtt");
  const { client, isConnected } = useMqttClient("ws://192.168.0.100:8083/mqtt");
  const [message, setMessage] = useState<RFIDPayloadType>({
    access: "",
    location: "",
    rfid_tag: "",
  });

  useEffect(() => {
    if (!client || !isConnected) return;

    const topic = "rfid/uid";

    client.subscribe(topic, (err) => {
      if (err) console.error("Subscribe error:", err);
      else console.log("Subscribed to topic:", topic);
    });

    client.on("message", (topic, payload) => {
      const parsed: RFIDPayloadType = JSON.parse(payload.toString());
      setMessage({
        ...message,
        access: parsed.access,
        location: parsed.location,
        rfid_tag: parsed.rfid_tag,
      });
    });

    return () => {
      client.unsubscribe(topic);
    };
  }, [client, isConnected, message]);

  return (
    <div>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <p>{message.access}</p>
      <p>{message.location}</p>
      <p>{message.rfid_tag}</p>
    </div>
  );
};

export default MQTTComponent;
