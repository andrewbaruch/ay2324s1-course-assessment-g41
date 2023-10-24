// const EASY_MATCHING_SUBSCRIPTION: string = "EASY_MATCHING_TOPIC-sub";
// const MEDIUM_MATCHING_SUBSCRIPTION: string = "MEDIUM_MATCHING_TOPIC-sub";
// const HARD_MATCHING_SUBSCRIPTION: string = "HARD_MATCHING_TOPIC-sub";

const MATCHING_REQUEST_VALID_DURATION_IN_SECONDS: number = 30;
const MATCHING_REQUEST_TOPIC_SUBSCRIPTION: string =
  "MATCHING_REQUEST_TOPIC-sub";

// const projectId = "operating-ally-401008";
// const STATUS_REQUEST: string = "STATUS_REQUEST";
// const STATUS_DONE: string = "STATUS_DONE";

// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";

// Creates a client; cache this for further use
const pubSubClient: PubSub = new PubSub();
// const pubSubClient: PubSub = new PubSub({
//   projectId,
//   keyFilename: "./key.json",
// });

// data structures
let matchingPairs: Record<string, string> = {};
let dequeuedPairs: Record<string, any[]> = {
  Easy: [],
  Medium: [],
  Hard: [],
};

import matchingRequestCache from "@/matchingRequestCache";
import matchingPairCache from "@/matchingPairCache";

// Create an event handler to handle messages
const messageHandler = (message: any): void => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();

  console.log("=======================================");
  console.log(matchingRequestCache.keys());
  console.log(matchingPairCache.keys());

  console.log("=======================================");
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);

  const parsedData = JSON.parse(message.data);

  if (parsedData.userId in matchingPairs) return;

  const complexity: string = parsedData.questionComplexity;
  dequeuedPairs[complexity].push(parsedData);

  // set request expiry to 30s, after that discard it
  matchingRequestCache.set(parsedData.userId, { complexity: complexity }, 30);

  console.log(dequeuedPairs);
  // remove expired requests
  const currentTime: number = new Date().getTime();
  while (dequeuedPairs[complexity].length != 0) {
    console.log(
      `time ${(currentTime - dequeuedPairs[complexity][0].time) / 1000}`
    );
    if (
      (currentTime - dequeuedPairs[complexity][0].time) / 1000 <=
      MATCHING_REQUEST_VALID_DURATION_IN_SECONDS
    ) {
      break;
    }
    dequeuedPairs[complexity].shift();
  }

  // If more than 2 messages already
  if (dequeuedPairs[complexity].length >= 2) {
    // get 2 users
    const user1: any = dequeuedPairs[complexity].shift();
    const user2: any = dequeuedPairs[complexity].shift();

    // send to matching topic, store matching pair
    const myData: string = JSON.stringify({
      userId1: user1.userId,
      userId2: user2.userId,
      complexity: complexity,
    });

    matchingPairs[user1.userId] = user2.userId;
    matchingPairs[user2.userId] = user1.userId;

    // TODO: call collab service here to get room id, replace "Dummyroom" with roomid below

    console.log(`user1=${user1.userId} user2=${user2.userId}`);
    console.log(`myData=${myData} `);

    console.log(
      "matched pair, inserting into cache",
      matchingPairCache.set(user1.userId, {
        userId2: user2.userId,
        complexity: complexity,
        roomId: "Dummyroom",
      }),
      matchingPairCache.set(user2.userId, {
        userId2: user1.userId,
        complexity: complexity,
        roomId: "Dummyroom",
      })
    );
  }
  console.log(`matchingpairs=${JSON.stringify(matchingPairs)}`);
};

const processMatching = (): void => {
  const matchingRequestSubscription = pubSubClient.subscription(
    MATCHING_REQUEST_TOPIC_SUBSCRIPTION
  );

  // Listen for new messages until timeout is hit
  matchingRequestSubscription.on("message", messageHandler);
};

export { processMatching };
