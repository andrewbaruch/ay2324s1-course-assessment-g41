import { NextApiRequest, NextApiResponse } from "next";
import { PubSub } from "@google-cloud/pubsub";

import { QuestionComplexity } from "@/@types/models/question";

const pubSubClient = new PubSub();
const MATCHING_QUEUE = "EASY_MATCHING_TOPIC";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { user, questionComplexity } = req.body;
    setUpPairCoding(user, questionComplexity);
    res.status(200).json({ message: "Request sent for matching." });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

function setUpPairCoding(user: string, questionComplexity: QuestionComplexity) {
  pairWithPeer(user, questionComplexity);
}

function pairWithPeer(user: string, questionComplexity: QuestionComplexity) {
  const data = JSON.stringify({
    userId: user,
    questionComplexity: questionComplexity,
    time: new Date().getTime(),
  });
  publishMessage(MATCHING_QUEUE, data);
}

async function publishMessage(topicName: string, data: any) {
  const dataBuffer = Buffer.from(data);
  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error: any) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}
