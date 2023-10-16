import { QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";

// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const MATCHING_QUEUE = "EASY_MATCHING_TOPIC";
// const MATCHING_QUEUE = "MATCHING_QUEUE";

class MatchingService {
  static setUpPairCoding(user: String, questionComplexity: QuestionComplexity) {
    MatchingService.pairWithPeer(user, questionComplexity);
  }

  private static pairWithPeer(user: String, questionComplexity: QuestionComplexity) {
    const data = JSON.stringify({
      userId: user,
      questionComplexity: questionComplexity,
      time: new Date().getTime(),
    });
    MatchingService.publishMessage(MATCHING_QUEUE, data);
  }

  // TODO: check how to fix type
  private static async publishMessage(topicName: String, data: any) {
    // const dataBuffer = Buffer.from(data);
    // try {
    //   const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
    //   console.log(`Message ${messageId} published.`);
    // } catch (error: any) {
    //   console.error(`Received error while publishing: ${error.message}`);
    //   process.exitCode = 1;
    // }
  }
}

export default MatchingService;
