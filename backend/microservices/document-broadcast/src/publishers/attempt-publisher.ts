import PubSubClient from "@/clients/pubsub";
import { Language } from "@/models/language";

class AttemptPublisher {
  private readonly pubSubClient: PubSubClient;
  private readonly attemptTopic: string;

  constructor() {
    this.pubSubClient = new PubSubClient();
    this.attemptTopic = "ATTEMPT_TOPIC"
  }

  publishToTopic({ attemptId, roomId, text, language }: { attemptId: string, roomId: string, text: string, language: Language }) {
    const data = JSON.stringify({ attemptId, roomId, text, language })
    this.pubSubClient.publishToTopic(this.attemptTopic, data)
  }
}

export default AttemptPublisher;