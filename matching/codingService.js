// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages(subscriptionId) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionId);

  // Create an event handler to handle messages
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on("message", messageHandler);
}

const EASY_MATCHING_TOPIC = "EASY_MATCHING_TOPIC";
const MEDIUM_MATCHING_TOPIC = "MEDIUM_MATCHING_TOPIC";
const HARD_MATCHING_TOPIC = "HARD_MATCHING_TOPIC";
const MATCHING_FOUND_TOPIC = "MATCHING_FOUND_TOPIC";

const EASY_MATCHING_SUBSCRIPTION = "EASY_MATCHING_TOPIC-sub";
const MEDIUM_MATCHING_SUBSCRIPTION = "MEDIUM_MATCHING_TOPIC-sub";
const HARD_MATCHING_SUBSCRIPTION = "HARD_MATCHING_TOPIC-sub";
const MATCHING_FOUND_SUBSCRIPTION = "MATCHING_FOUND_TOPIC-sub";


listenForMessages(MATCHING_FOUND_SUBSCRIPTION);
