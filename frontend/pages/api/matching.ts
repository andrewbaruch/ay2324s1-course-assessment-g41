import { PubSub } from "@google-cloud/pubsub";

const pubSubClient = new PubSub();
const MATCHING_QUEUE = "EASY_MATCHING_TOPIC";

export default function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    const { user, questionComplexity } = req.body;
    setUpPairCoding(user, questionComplexity);
    res.status(200).json({ message: "Request sent for matching." });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

function setUpPairCoding(user, questionComplexity) {
  pairWithPeer(user, questionComplexity);
}

function pairWithPeer(user, questionComplexity) {
  const data = JSON.stringify({
    userId: user,
    questionComplexity: questionComplexity,
    time: new Date().getTime(),
  });
  publishMessage(MATCHING_QUEUE, data);
}

async function publishMessage(topicName, data) {
  const dataBuffer = Buffer.from(data);
  try {
    const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}
