import PubSubClient from "@/clients/pubsub";
import AttemptMessageData from "@/models/attempt-message-data";
import * as AttemptService from "@/services/attempt-service";
import { Message } from "@google-cloud/pubsub";

class AttemptSubscriber {
  private readonly pubSubClient: typeof PubSubClient;
  // TODO: push topic into env variables
  private readonly attemptTopic: string = "ATTEMPT_TOPIC";

  constructor() {
    this.pubSubClient = PubSubClient;
  }

  subscribeToAttemptTopic() {
    this.pubSubClient.subscribeToTopic(this.attemptTopic, this.handleMessage);
  }

  private async handleMessage(message: Message) {
    message.ack();
    try {
      console.log("=================ATTEMPT SERVICE SUBSCRIPTION==================");
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);

      const { attemptId, text, language, roomName } = JSON.parse(message.data.toString()) as AttemptMessageData;
      await AttemptService.saveAttemptToDatabase({ attemptId, text, language, roomName });  
    } catch (err) {
      // allow graceful timeout from waiting
      console.error(`message ${message.id} has an error:`, err)
    }
  }
  
}

export default AttemptSubscriber;