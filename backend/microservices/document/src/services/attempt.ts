import { Language } from "@/models/language";
import AttemptPublisher from "@/publishers/attempt-publisher";

const saveAttempt = ({ roomName, attemptId, text, language, questionId }: { roomName: string; attemptId: string; text: string; language: Language, questionId: string }) => {
  const publisher = new AttemptPublisher()
  publisher.publishToTopic({
    attemptId, text, language, roomName, questionId
  })
}

export {
  saveAttempt
}