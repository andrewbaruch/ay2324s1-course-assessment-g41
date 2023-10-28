import PubSubClient from "@/clients/pubsub";
import { MATCHING_REQUEST_TOPIC_PUBLISH } from "@/constants/matching-request";

class ComplexityMatchingPushService {
  private readonly pubSubClient: PubSubClient;

  constructor() {
    this.pubSubClient = new PubSubClient()
  }

  pushMatchingRequest(userId: string, questionComplexity: string) {
    const data = JSON.stringify({
      userId,
      questionComplexity,
      time: new Date().getTime(),
    });
    this.publishToTopic(MATCHING_REQUEST_TOPIC_PUBLISH, data)
  }

  private publishToTopic(topic: string, data: string) {
    this.pubSubClient.publishToTopic(topic, data)
  }
}

export default ComplexityMatchingPushService;