"use client";

import { RFIDPayloadSchema } from "@/schema/mqtt-payload";
import { z } from "zod";
import CheckCardRFID from "./card/check-card";
import { useMQTT } from "@/context/mqtt-context";

const MQTTComponent = () => {
  const { messages } = useMQTT();

  return (
    <>
      {/* {JSON.stringify(messages)} */}
      <Connected message={messages} />
    </>
  );
};

const Connected = ({
  message,
}: {
  message: z.infer<typeof RFIDPayloadSchema> | undefined;
}) => {
  if (!message) {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center gap-2">
        <p>Please Tap the Card</p>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center">
      <CheckCardRFID items={message} />
    </div>
  );
};

export default MQTTComponent;
