import AttemptMessageData from "@/models/attempt-message-data";

const saveAttemptToDatabase = async (attemptData: AttemptMessageData) => {
  // TODO: write into mongodb
}

const findAttemptFromDatabase = async (attemptId: string) => {
  
}

export {
  saveAttemptToDatabase,
  findAttemptFromDatabase
};
