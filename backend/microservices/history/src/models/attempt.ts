import MongoClient from "@/clients/mongo-mongoose";

const AttemptSchema = new MongoClient.Schema({
  attemptId: String,
  text: String,
  roomName: String,
  language: {
    label: String,
    value: String,
  },
});

const AttemptModel = MongoClient.model("Attempt", AttemptSchema);

export default AttemptModel;
