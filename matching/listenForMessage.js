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


const MATCHING_FOUND_SUBSCRIPTION = "MATCHING FOUND_SUBSCRIPTION";

listenForMessages(MATCHING_FOUND_SUBSCRIPTION);
