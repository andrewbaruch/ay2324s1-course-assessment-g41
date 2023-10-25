
import PubSubClient from "@/clients/pubsub";
import { MATCHING_REQUEST_TOPIC_SUBSCRIPTION, MATCHING_REQUEST_VALID_DURATION_IN_SECONDS } from "@/constants/matching-request";
import ComplexityMatchingService from "@/services/complexity-matching-service";
import complexityMatchingPairCache from "@/utils/complexity-matching-pair-cache";
import complexityMatchingRequestCache from "@/utils/complexity-matching-request-cache";
import { Message } from "@google-cloud/pubsub";

/**
 * Listener service that "pulls" messages from Google PubSub on the question complexity topic.
 */
class ComplexitySubscriber {
  private readonly pubSubClient: PubSubClient;
  private readonly complexityMatchingService: ComplexityMatchingService;

  constructor() {
    this.pubSubClient = new PubSubClient()
    this.complexityMatchingService = new ComplexityMatchingService()
  }

  start() {
    complexityMatchingRequestCache.flushAll();
    complexityMatchingPairCache.flushAll();
    this.pubSubClient.subscribeToTopic(MATCHING_REQUEST_TOPIC_SUBSCRIPTION, this.handleMessage)
  }

  private handleMessage(message: Message) {
    message.ack();
    console.log("=======================================");
    console.log(complexityMatchingRequestCache.keys());
    console.log(complexityMatchingPairCache.keys());

    console.log("=======================================");
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    const parsedData = JSON.parse(message.data.toString());

    if (this.complexityMatchingService.isUserAlreadyMatched(parsedData.userId)) return;

    const complexity = this.complexityMatchingService.registerRequestForMatch(parsedData)
    // add to request cache
    complexityMatchingRequestCache.set(parsedData.userId, { complexity: complexity }, MATCHING_REQUEST_VALID_DURATION_IN_SECONDS);

    this.complexityMatchingService.removeExpiredRequestsOfComplexity(complexity)
    const { roomId, user1, user2 } = this.complexityMatchingService.matchUsersIfMoreThanTwo(complexity)

    if (roomId) {
      // update matchingPairCache
      console.log(
        "matched pair, inserting into cache",
        complexityMatchingPairCache.set(user1.userId, {
          userId2: user2.userId,
          complexity: complexity,
          roomId: roomId,
        }),
        complexityMatchingPairCache.set(user2.userId, {
          userId2: user1.userId,
          complexity: complexity,
          roomId: roomId,
        })
      );
    }
    console.log(`matchingpairs=${JSON.stringify(this.complexityMatchingService.matchingPairs)}`);
  }
}

export default ComplexitySubscriber;