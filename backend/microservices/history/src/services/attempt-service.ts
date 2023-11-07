import AttemptMessageData from "@/models/attempt-message-data";
import AttemptModel from "@/models/attempt";

const saveAttemptToDatabase = async (attemptData: AttemptMessageData) => {
  const options = {
    upsert: true
  }

  const query = {
    attemptId: attemptData.attemptId,
  }

  const doc = await AttemptModel.findOneAndUpdate(query, attemptData, options)
  console.log("Upserted into attempt collection", doc?.attemptId, doc?.roomName, doc?.text, doc?.language?.label)
  return doc;
}

const findAttemptFromDatabase = async (attemptId: string) => {
  const query = { attemptId }
  const doc = await AttemptModel.findOne(query)
  console.log("Found doc from attempt collection", doc)
  return doc;
}

export {
  saveAttemptToDatabase,
  findAttemptFromDatabase
};
