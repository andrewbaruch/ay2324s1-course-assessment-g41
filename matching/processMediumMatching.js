// import { EASY_MATCHING_SUBSCRIPTION, MATCHING_TOPIC } from ".constants";

// import { publishMessage } from ".publishMessage";
const EASY_MATCHING_TOPIC = "EASY_MATCHING_TOPIC";
const MEDIUM_MATCHING_TOPIC = "MEDIUM_MATCHING_TOPIC";
const HARD_MATCHING_TOPIC = "HARD_MATCHING_TOPIC";
const MATCHING_FOUND_TOPIC = "MATCHING_FOUND_TOPIC";

const EASY_MATCHING_SUBSCRIPTION = "EASY_MATCHING_TOPIC-sub";
const MEDIUM_MATCHING_SUBSCRIPTION = "MEDIUM_MATCHING_TOPIC-sub";
const HARD_MATCHING_SUBSCRIPTION = "HARD_MATCHING_TOPIC-sub";
const MATCHING_FOUND_SUBSCRIPTION = "MATCHING_FOUND_TOPIC-sub";
const MATCHING_REQUEST_VALID_DURATION_IN_SECONDS = 30;

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

var matchingPairs = {};
var dequeuedPairs = [];

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

function processMatching(subscriptionId) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionId);

  // Create an event handler to handle messages
  const messageHandler = (message) => {
    console.log("=======================================");
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    // "Ack" (acknowledge receipt of) the message
    message.ack();

    dequeuedPairs.push(JSON.parse(message.data));

    // remove expired requests
    const currentTime = new Date().getTime();
    while (true) {
      console.log(`time ${(currentTime - dequeuedPairs[0].time) / 1000}`);
      if (
        (currentTime - dequeuedPairs[0].time) / 1000 <=
        MATCHING_REQUEST_VALID_DURATION_IN_SECONDS
      ) {
        break;
      }
      dequeuedPairs.shift();
    }

    console.log(dequeuedPairs);
    // If more than 2 messages already
    if (dequeuedPairs.length >= 2) {
      // get 2 users
      const user1 = dequeuedPairs.shift();
      const user2 = dequeuedPairs.shift();

      // send to matching topic, store matching pair
      const myData = JSON.stringify({
        userId: user1.userId,
        userId2: user2.userId,
      });

      matchingPairs[user1] = user2;
      matchingPairs[user2] = user1;

      console.log(`user1=${user1} user2=${user2}`);
      console.log(`myData=${myData} matchingpairs=${matchingPairs}`);
      publishMessage(MATCHING_FOUND_TOPIC, myData);
    }
  };

  // Listen for new messages until timeout is hit
  subscription.on("message", messageHandler);
}

processMatching(MEDIUM_MATCHING_SUBSCRIPTION);

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
