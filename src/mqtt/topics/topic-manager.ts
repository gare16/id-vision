import { MqttClient } from "mqtt";

import { TopicHandler } from "./topic-handler.interface";

export class MQTTTopicManager {
  private handlers: Map<string, TopicHandler> = new Map();

  constructor(private client: MqttClient) {}

  registerHandler(handler: TopicHandler): void {
    if (this.handlers.has(handler.topic)) {
      console.warn(
        `Handler for topic ${handler.topic} already exists, replacing...`,
      );
      this.unregisterHandler(handler.topic);
    }

    this.handlers.set(handler.topic, handler);
    handler.initialize(this.client);

    console.log(`Registered handler for topic: ${handler.topic}`);
  }

  unregisterHandler(topic: string): void {
    const handler = this.handlers.get(topic);
    if (handler) {
      handler.cleanup();
      this.handlers.delete(topic);
      console.log(`Unregistered handler for topic: ${topic}`);
    }
  }

  unregisterAll(): void {
    for (const [topic, handler] of this.handlers) {
      handler.cleanup();
      console.log(`Unregistered handler for topic: ${topic}`);
    }
    this.handlers.clear();
  }

  getHandler(topic: string): TopicHandler | undefined {
    return this.handlers.get(topic);
  }

  getAllTopics(): string[] {
    return Array.from(this.handlers.keys());
  }
}
