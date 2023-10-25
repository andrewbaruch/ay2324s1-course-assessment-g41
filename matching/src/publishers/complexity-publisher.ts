import PubSubClient from "@/clients/pubsub";

class ComplexityPublisher {
  private readonly pubSubClient: PubSubClient;

  constructor() {
    this.pubSubClient = new PubSubClient();
  }

  publishToTopic(topic: string, data: string) {
    this.pubSubClient.publishToTopic(topic, data)
  }
}

export default ComplexityPublisher;