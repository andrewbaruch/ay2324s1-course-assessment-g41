// import { EASY_MATCHING_TOPIC } from ".constants";

// import { publishMessage } from ".publishMessage";

const EASY_MATCHING_TOPIC = "EASY_MATCHING_TOPIC";
const MEDIUM_MATCHING_TOPIC = "MEDIUM_MATCHING_TOPIC";
const HARD_MATCHING_TOPIC = "HARD_MATCHING_TOPIC";
const MATCHING_FOUND_TOPIC = "MATCHING_FOUND_TOPIC";

const EASY_MATCHING_SUBSCRIPTION = "EASY_MATCHING_TOPIC-sub";
const MEDIUM_MATCHING_SUBSCRIPTION = "MEDIUM_MATCHING_TOPIC-sub";
const HARD_MATCHING_SUBSCRIPTION = "HARD_MATCHING_TOPIC-sub";
const MATCHING_FOUND_SUBSCRIPTION = "MATCHING_FOUND_TOPIC-sub";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

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

const data = JSON.stringify({
  userId: process.argv[2],
  time: new Date().getTime(),
});

publishMessage(EASY_MATCHING_TOPIC, data);
