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

  publishToTopic(topic: string, data: string) {
    this.client.topic(topic).publishMessage({
      data: Buffer.from(data)
    })
  }
}

export default PubSubClient;
