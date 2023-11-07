import Language from "./language";

interface AttemptMessageData {
  roomName: string;
  attemptId: string;
  language: Language;
  text: string;
}

export default AttemptMessageData;