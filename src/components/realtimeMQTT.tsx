"use client";

import { z } from "zod";

import { useMQTT } from "@/context/mqtt-context";
import { RFIDCheckPayloadSchema } from "@/schema/mqtt-payload";

import CheckCardRFID from "./card/check-card";

const MQTTComponent = () => {
  const { messages } = useMQTT();

  return (
    <>
      <Connected message={messages} />
    </>
  );
};

const Connected = ({
  message,
}: {
  message: z.infer<typeof RFIDCheckPayloadSchema> | undefined;
}) => {
  if (!message) {
    return (
      <div className="w-full min-h-dvh flex flex-col justify-center items-center gap-2">
        <p>Please Tap the Card</p>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh flex flex-col justify-center items-center">
      <CheckCardRFID items={message} />
    </div>
  );
};

export default MQTTComponent;
