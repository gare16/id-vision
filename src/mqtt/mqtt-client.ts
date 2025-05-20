import mqtt from "mqtt";

export const createMQTTClient = () => {
  const brokerUrl = "mqtt://192.168.43.85:1883";
  return mqtt.connect(brokerUrl, {
    clientId: "nextjs_app_" + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  });
};
