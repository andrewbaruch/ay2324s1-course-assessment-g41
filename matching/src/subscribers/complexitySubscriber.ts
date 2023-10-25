
import PubSubClient from "@/clients/pubsub";
import { MATCHING_REQUEST_TOPIC_SUBSCRIPTION, MATCHING_REQUEST_VALID_DURATION_IN_SECONDS } from "@/constants/matchingRequest";
import MatchingService from "@/services/matching-service";
import matchingPairCache from "@/utils/matchingPairCache";
import matchingRequestCache from "@/utils/matchingRequestCache";
import { Message } from "@google-cloud/pubsub";

/**
 * Listener service that "pulls" messages from Google PubSub on the question complexity topic.
 */
class ComplexitySubscriber {
  readonly pubSubClient: PubSubClient;
  readonly matchingService: MatchingService;

  constructor() {
    this.pubSubClient = new PubSubClient()
    this.matchingService = new MatchingService()
  }

  start() {
    matchingRequestCache.flushAll();
    matchingPairCache.flushAll();
    this.pubSubClient.subscribeToTopic(MATCHING_REQUEST_TOPIC_SUBSCRIPTION, this.handleMessage)
  }

  private handleMessage(message: Message) {
    message.ack();
    console.log("=======================================");
    console.log(matchingRequestCache.keys());
    console.log(matchingPairCache.keys());

    console.log("=======================================");
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    const parsedData = JSON.parse(message.data.toString());

    if (this.matchingService.isUserAlreadyMatched(parsedData.userId)) return;

    const complexity = this.matchingService.registerRequestForMatch(parsedData)
    // add to request cache
    matchingRequestCache.set(parsedData.userId, { complexity: complexity }, MATCHING_REQUEST_VALID_DURATION_IN_SECONDS);

    this.matchingService.removeExpiredRequestsOfComplexity(complexity)
    const { roomId, user1, user2 } = this.matchingService.matchUsersIfMoreThanTwo(complexity)

    if (roomId) {
      // update matchingPairCache
      console.log(
        "matched pair, inserting into cache",
        matchingPairCache.set(user1.userId, {
          userId2: user2.userId,
          complexity: complexity,
          roomId: roomId,
        }),
        matchingPairCache.set(user2.userId, {
          userId2: user1.userId,
          complexity: complexity,
          roomId: roomId,
        })
      );
    }
    console.log(`matchingpairs=${JSON.stringify(this.matchingService.matchingPairs)}`);
  }
}

export default ComplexitySubscriber;