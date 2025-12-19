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

import { createLogVisitor } from "@/lib/action/rfid";
import { RFIDPayloadSchema } from "@/schema/mqtt-payload";

type MQTTContextType = {
  client: mqtt.MqttClient | null;
  messages: z.infer<typeof RFIDPayloadSchema> | undefined;
};

const MQTTContext = createContext<MQTTContextType>({
  client: null,
  messages: {
    access: "",
    location: "",
    name: "",
    nik: "",
    rfidTag: "",
    status: "",
  },
});

export const MQTTProvider = ({ children }: { children: React.ReactNode }) => {
  const websocketUrl =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://192.168.43.85:8083/mqtt";
  const [messages, setMessages] = useState<z.infer<typeof RFIDPayloadSchema>>();
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(websocketUrl);
    const topic = "rfid/uid";
    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic);
    });

    client.on("message", async (_topic, message) => {
      try {
        const parsed: z.infer<typeof RFIDPayloadSchema> = JSON.parse(
          message.toString(),
        );

        setMessages(parsed);

        const ps = {
          data: {
            ...parsed,
          },
        };
        if (parsed.status === "available") {
          await handleCreateLogHistory(ps);
        }
      } catch (error) {
        console.error("Invalid message:", error);
      }
    });

    return () => {
      client.end();
    };
  }, [websocketUrl]);

  return (
    <MQTTContext.Provider value={{ client: clientRef.current, messages }}>
      {children}
    </MQTTContext.Provider>
  );
};

async function handleCreateLogHistory({
  data,
}: {
  data: z.infer<typeof RFIDPayloadSchema>;
}) {
  const access = data.access === "allowed";
  const payload = {
    data: {
      access: access,
      nik: data.nik,
      date: new Date(),
      location: data.location,
      rfid_tag: data.rfidTag,
    },
  };
  try {
    await createLogVisitor(payload).then((res) => {
      if (!res.success) {
        console.error(res.error);
      } else {
        console.log("Created: ", res.data);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export const useMQTT = () => useContext(MQTTContext);
