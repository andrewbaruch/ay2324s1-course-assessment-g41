import { Request, Response } from 'express';
import { Question } from '@/models/question'; // Adjust the import path as needed
import QuestionService from '@/services/question-service'; 


const questionService = new QuestionService();

export async function createQuestion(req: Request, res: Response) {
  try {
    const newQuestion: Question = req.body;
    await questionService.createQuestion(newQuestion);
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
}

export async function getQuestionById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const question = await questionService.getQuestionById(id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send();
  }
}

export async function getFilteredQuestions(req: Request, res: Response) {
  try {
    const { difficulties, sorting } = req.query;

    if (!difficulties) {
      return res.status(400).send('Invalid difficulties parameter');
    }

    if (!Array.isArray(difficulties)) {

    }

    // const sortedQuestions = await questionService.getFilteredQuestions(
    //   difficulties.map((d: string) => parseInt(d, 10)),
    //   sorting as 'asc' | 'desc' | 'nil'
    // );

    // res.json(sortedQuestions);
  } catch (error) {
    res.status(500).send();
  }
}


export async function updateQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const update: Partial<Question> = req.body;
    const updatedQuestion = await questionService.updateQuestion(id, update);

    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await questionService.deleteQuestion(id);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send();
  }
}
