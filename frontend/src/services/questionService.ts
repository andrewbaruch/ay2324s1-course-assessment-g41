import { Question } from '@/@types/models/question';

import { QuestionComplexity } from '@/@types/models/question';

const PEER_PREP_A1_KEY = 'PEER_PREP_A1_KEY';

// TODO: refactor to interface with backend question microservice
class QuestionService {
  static addQuestion({
    title,
    description,
    complexity,
    categories,
  }: {
    title: string;
    description: string;
    complexity: QuestionComplexity;
    categories: string[];
  }) {
    try {
      QuestionService.validateAddQuestion({
        title,
        description,
        complexity,
        categories,
      });
    } catch (err) {
      throw err;
    }

    // local storage
    const id = this.getLatestQuestionId();
    const questions = this.getQuestions();
    questions.push({
      id,
      title,
      description,
      complexity,
      categories,
    });
    localStorage?.setItem(PEER_PREP_A1_KEY, JSON.stringify(questions));
  }

  static removeQuestion({ id }: { id: number }) {
    const questions = this.getQuestions();
    const filteredQuestions = questions.filter((q) => q.id !== id);
    localStorage?.setItem(PEER_PREP_A1_KEY, JSON.stringify(filteredQuestions));
  }

  static editQuestion(questionData: Question) {
    try {
      QuestionService.validateAddQuestion(questionData);
    } catch (err) {
      throw err;
    }

    let allQuestions: Question[] = [];

    this.getQuestions().forEach((q) => {
      if (q.id === questionData.id) {
        q = { ...questionData };
      }
      allQuestions.push(q);
    });
    localStorage?.setItem(PEER_PREP_A1_KEY, JSON.stringify(allQuestions));
  }

  private static getLatestQuestionId() {
    const questions = this.getQuestions();
    return questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
  }

  static getQuestions() {
    const storage = localStorage?.getItem(PEER_PREP_A1_KEY);
    if (!storage) {
      return [];
    }
    const questions: Question[] = JSON.parse(storage);
    return questions;
  }

  private static validateAddQuestion({
    title,
    description,
    complexity,
    categories,
  }: {
    title: string;
    description: string;
    complexity: QuestionComplexity;
    categories: string[];
  }) {
    if (!title) {
      throw new Error('Missing title field.');
    }
    if (!description) {
      throw new Error('Missing description field.');
    }

    if (!complexity) {
      throw new Error('Missing complexity field.');
    }

    if (!categories || categories.length === 0) {
      throw new Error('Missing categories field.');
    }

    // check if duplicate exists
    const questions = this.getQuestions();
    const isDuplicate =
      questions
        .filter(
          (q) =>
            q.title === title &&
            q.description === description &&
            q.complexity === q.complexity &&
            q.categories.length === categories.length,
        )
        .filter((q) => {
          let setOfCategories = new Set([...categories]);
          q.categories.forEach((cat) => {
            if (!setOfCategories.has(cat)) {
              return false;
            }
          });

          return true;
        }).length > 0;

    if (isDuplicate) {
      throw new Error('Exact question already exists. No change detected.');
    }

    return true;
  }
}

export default QuestionService;
