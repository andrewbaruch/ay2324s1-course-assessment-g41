import { Attempt } from "@/@types/attempt";
import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import QuestionService from "./question";

const getAllAttemptsInRoom = async (roomName: string): Promise<(Attempt & { roomName: string, text: string })[]> => {
  const response = await authorizedAxios.get(`${BE_API.history}/${roomName}`);
  console.log(response);
  const listOfAttempts: { questionId: string, text: string, language: Language, attemptId: number }[] = response.data
  console.log('attempts', listOfAttempts);
  let questions: (Question | null)[] = []
  try {
    questions = await Promise.all(listOfAttempts.map(attempt => QuestionService.getQuestion(attempt.questionId)));
  } catch (err) {
    listOfAttempts.forEach(async (attempt) => {
      try {
        const question = await QuestionService.getQuestion(attempt.questionId);
        questions.push(question);
      } catch (err) {
        questions.push(null);
      }
    })
  }

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
  let question: Question | null
  try {
    question = await QuestionService.getQuestion(questionId);
  } catch (err) {
    question = null;
  }
  
  return {
    attemptId,
    question,
    roomName,
    text,
    language
  };
}

const getAllAttemptsByUser = async () => {
  try {
    const response = await authorizedAxios.get(`${BE_API.history}`);
    const attempts = response.data;
    return attempts;
  } catch (err) {
    console.log(err);
    return []
  }
  
}

export {
  getAllAttemptsInRoom,
  getAttempt,
  getAllAttemptsByUser
}