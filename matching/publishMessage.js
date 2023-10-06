// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const data = JSON.stringify({ userId: 1, time: new Date().getTime() });

export async function publishMessage(topicName, data) {
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

// /**
//  * TODO(developer): Uncomment these variables before running the sample.
//  */

// const topicNameOrId = "MyTopic";
// const data = JSON.stringify({ foo: "test2" });

// // Imports the Google Cloud client library
// const { PubSub } = require("@google-cloud/pubsub");

// // Creates a client; cache this for further use
// const pubSubClient = new PubSub();

// async function publishMessage(topicNameOrId, data) {
//   // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
//   const dataBuffer = Buffer.from(data);

//   try {
//     const messageId = await pubSubClient
//       .topic(topicNameOrId)
//       .publishMessage({ data: dataBuffer });
//     console.log(`Message ${messageId} published.`);
//   } catch (error) {
//     console.error(`Received error while publishing: ${error.message}`);
//     process.exitCode = 1;
//   }
// }
// publishMessage(topicNameOrId, data);
