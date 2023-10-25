import { PubSub, Message } from "@google-cloud/pubsub";

class PubSubClient {
  readonly client: PubSub;

  constructor() {
    this.client = new PubSub()
  }

  subscribeToTopic(topic: string, messageHandler: (message: Message) => void) {
    const subscription = this.client.subscription(topic)
    subscription.on("message", messageHandler);
  }
}

export default PubSubClient;
