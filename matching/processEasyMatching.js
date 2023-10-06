// import { EASY_MATCHING_SUBSCRIPTION, MATCHING_TOPIC } from ".constants";

// import { publishMessage } from ".publishMessage";
const EASY_MATCHING_TOPIC = "EASY_MATCHING_TOPIC";
const MEDIUM_MATCHING_TOPIC = "MEDIUM_MATCHING_TOPIC";
const HARD_MATCHING_TOPIC = "HARD_MATCHING_TOPIC";
const MATCHING_FOUND_TOPIC = "MATCHING_FOUND_TOPIC";

const EASY_MATCHING_SUBSCRIPTION = "EASY_MATCHING_TOPIC-sub";
const MEDIUM_MATCHING_SUBSCRIPTION = "MEDIUM_MATCHING_TOPIC-sub";
const HARD_MATCHING_SUBSCRIPTION = "HARD_MATCHING_TOPIC-sub";
const MATCHING_FOUND_SUBSCRIPTION = "MATCHING_STATUS_PROCESSING-sub";
const MATCHING_REQUEST_VALID_DURATION_IN_SECONDS = 30;

const STATUS_REQUEST = "STATUS_REQUEST";
const STATUS_DONE = "STATUS_DONE";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

// data structures
var matchingPairs = {};
var dequeuedPairs = {
  EASY_MATCHING_TOPIC: [],
  MEDIUM_MATCHING_TOPIC: [],
  HARD_MATCHING_TOPIC: [],
};

// function to send message to queue
async function publishMessage(topicName, data) {
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient
      .topic(topicName)
      .publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

// Create an event handler to handle matching status
const matchingStatusHandler = (message) => {
  console.log("****************");
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);

  // "Ack" (acknowledge receipt of) the message
  message.ack();

  const parsedData = JSON.parse(message.data);

  if (parsedData.status === STATUS_DONE) {
    const userId1 = parsedData.userId1;
    const userId2 = parsedData.userId2;

    delete matchingPairs[userId1];
    delete matchingPairs[userId2];
  }
};

// Create an event handler to handle messages
const messageHandler = (message) => {
  console.log("=======================================");
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);

  // "Ack" (acknowledge receipt of) the message
  message.ack();

  const parsedData = JSON.parse(message.data);

  if (parsedData.userId in matchingPairs) return;

  const complexity = parsedData.topicName;
  dequeuedPairs[complexity].push(parsedData);

  console.log(dequeuedPairs);
  // remove expired requests
  const currentTime = new Date().getTime();
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
    const user1 = dequeuedPairs[complexity].shift();
    const user2 = dequeuedPairs[complexity].shift();

    // send to matching topic, store matching pair
    const myData = JSON.stringify({
      userId1: user1.userId,
      userId2: user2.userId,
      complexity: complexity,
    });

    matchingPairs[user1.userId] = user2.userId;
    matchingPairs[user2.userId] = user1.userId;

    console.log(`user1=${user1.userId} user2=${user2.userId}`);
    console.log(`myData=${myData} `);
    publishMessage(MATCHING_FOUND_TOPIC, myData);
  }
  console.log(`matchingpairs=${JSON.stringify(matchingPairs)}`);
};

function processMatching() {
  const easySubscription = pubSubClient.subscription(
    EASY_MATCHING_SUBSCRIPTION
  );
  const mediumSubscription = pubSubClient.subscription(
    MEDIUM_MATCHING_SUBSCRIPTION
  );
  const hardSubscription = pubSubClient.subscription(
    HARD_MATCHING_SUBSCRIPTION
  );
  const matchingStatusSubscription = pubSubClient.subscription(
    MATCHING_FOUND_SUBSCRIPTION
  );

  // Listen for new messages until timeout is hit
  easySubscription.on("message", messageHandler);
  mediumSubscription.on("message", messageHandler);
  hardSubscription.on("message", messageHandler);
  matchingStatusSubscription.on("message", matchingStatusHandler);
}

processMatching(EASY_MATCHING_SUBSCRIPTION);

// /**
//  * TODO(developer): Uncomment these variables before running the sample.
//  */
// const subscriptionId = "MyTopic-sub";
// const timeout = 60;

// // Imports the Google Cloud client library
// const { PubSub } = require("@google-cloud/pubsub");

// // Creates a client; cache this for further use
// const pubSubClient = new PubSub();

// function listenForMessages(subscriptionId, timeout) {
//   // References an existing subscription
//   const subscription = pubSubClient.subscription(subscriptionId);

//   // Create an event handler to handle messages
//   let messageCount = 0;
//   const messageHandler = (message) => {
//     console.log(`Received message ${message.id}:`);
//     console.log(`\tData: ${message.data}`);
//     console.log(`\tAttributes: ${message.attributes}`);
//     messageCount += 1;

//     // "Ack" (acknowledge receipt of) the message
//     message.ack();
//   };

//   // Listen for new messages until timeout is hit
//   subscription.on("message", messageHandler);

//   // Wait a while for the subscription to run. (Part of the sample only.)
//   // setTimeout(() => {
//   //   subscription.removeListener("message", messageHandler);
//   //   console.log(`${messageCount} message(s) received.`);
//   // }, timeout * 1000);
// }

// listenForMessages(subscriptionId, timeout);
