import { Attempt } from "@/@types/attempt";
import { Language } from "@/@types/language";
import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import QuestionService from "./question";

const getAllAttemptsInRoom = async (roomName: string): Promise<(Attempt & { roomName: string, text: string })[]> => {
  const response = await (await authorizedAxios.get(`${BE_API.history}/${roomName}`));
  const listOfAttempts: { questionId: string, text: string, language: Language, attemptId: number }[] = response.data
  const questions = await Promise.all(listOfAttempts.map(attempt => QuestionService.getQuestion(attempt.questionId)));

  return listOfAttempts.map( (attempt, index) => {
    const { text, language, attemptId } = attempt
    const question = questions[index]
    return {
      roomName,
      attemptId,
      question,
      text,
      language
    }
  });
}

const getAttempt = async (attemptId: number, roomName: string): Promise<Attempt & { roomName: string, text: string }> => {
  const response = await authorizedAxios.get(`${BE_API.history}/${roomName}/${attemptId}`);
  const { questionId, text, language }: { questionId: string, text: string, language: Language } = response.data;
  const question = await QuestionService.getQuestion(questionId);
  
  return {
    attemptId,
    question,
    roomName,
    text,
    language
  };
}

export {
  getAllAttemptsInRoom,
  getAttempt
}