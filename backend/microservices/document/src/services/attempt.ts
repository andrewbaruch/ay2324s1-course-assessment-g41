import { Language } from "@/models/language";
import AttemptPublisher from "@/publishers/attempt-publisher";

const saveAttempt = ({ roomName, attemptId, text, language }: { roomName: string; attemptId: string; text: string; language: Language }) => {
  const publisher = new AttemptPublisher()
  publisher.publishToTopic({
    attemptId, text, language, roomName
  })
}

export {
  saveAttempt
}