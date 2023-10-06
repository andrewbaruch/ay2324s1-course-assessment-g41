// import { EASY_MATCHING_TOPIC } from ".constants";

// import { publishMessage } from ".publishMessage";

// const EASY_COMPLEXITY = "EASY_COMPLEXITY"
// const MEDIUM_COMPLEXITY = "MEDIUM_COMPLEXITY"
// const HARD_COMPLEXITY = "HARD_COMPLEXITY"

const EASY_MATCHING_TOPIC = "EASY_MATCHING_TOPIC";
const MEDIUM_MATCHING_TOPIC = "MEDIUM_MATCHING_TOPIC";
const HARD_MATCHING_TOPIC = "HARD_MATCHING_TOPIC";
const MATCHING_FOUND_TOPIC = "MATCHING_FOUND_TOPIC";

const EASY_MATCHING_SUBSCRIPTION = "EASY_MATCHING_TOPIC-sub";
const MEDIUM_MATCHING_SUBSCRIPTION = "MEDIUM_MATCHING_TOPIC-sub";
const HARD_MATCHING_SUBSCRIPTION = "HARD_MATCHING_TOPIC-sub";
const MATCHING_FOUND_SUBSCRIPTION = "MATCHING_FOUND_TOPIC-sub";

const STATUS_DONE = "STATUS_DONE";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(topicName) {
  const data = JSON.stringify({
    userId: process.argv[3],
    time: new Date().getTime(),
    topicName: topicName,
  });

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

async function publishDoneMessage(topicName) {
  const data = JSON.stringify({
    userId1: process.argv[3],
    userId2: process.argv[4],
    status: STATUS_DONE,
  });

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

function sendRequest(complexity) {
  if (complexity === "e") publishMessage(EASY_MATCHING_TOPIC);
  else if (complexity === "m") publishMessage(MEDIUM_MATCHING_TOPIC);
  else if (complexity === "h") publishMessage(HARD_MATCHING_TOPIC);
  else if (complexity === "d") publishDoneMessage(MATCHING_FOUND_TOPIC);
}

sendRequest(process.argv[2]);
