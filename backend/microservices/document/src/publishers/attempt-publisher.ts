import PubSubClient from "@/clients/pubsub";
import { Language } from "@/models/language";

class AttemptPublisher {
  private readonly pubSubClient: PubSubClient;
  private readonly attemptTopic: string = "ATTEMPT_TOPIC";

  constructor() {
    this.pubSubClient = new PubSubClient();
  }

  publishToTopic({ attemptId, roomName, text, language }: { attemptId: string, roomName: string, text: string, language: Language }) {
    const data = JSON.stringify({ attemptId, roomName, text, language })
    this.pubSubClient.publishToTopic(this.attemptTopic, data)
  }
}

export default AttemptPublisher;