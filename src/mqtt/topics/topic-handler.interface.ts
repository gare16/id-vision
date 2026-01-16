import { MqttClient } from "mqtt";

export interface TopicHandler {
  topic: string;
  initialize(client: MqttClient): void;
  cleanup(): void;
}
