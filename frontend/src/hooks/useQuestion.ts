import { useEffect, useState } from "react"
import { atom, useAtom } from 'jotai'
import { Question } from "@/types/models/question";

interface QuestionAtom {
  question: Question | undefined
}

const questionAtom = atom<QuestionAtom>({
  question: undefined
})

export const useQuestion = () => {
  const [questionWrapper, setQuestionWrapper] = useAtom(questionAtom)
  const [hasSelectedQuestion, setHasSelectedQuestion] = useState(questionWrapper.question !== undefined)

  useEffect(() => {
    setHasSelectedQuestion(questionWrapper.question !== undefined)
  }, [questionWrapper])

  const setQuestion = (q: Question|undefined = undefined) => {
    setQuestionWrapper({
      question: q
    })
    return
  }
  
  return {hasSelectedQuestion, setQuestion, question: questionWrapper.question}
}