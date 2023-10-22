import { Question } from "@/@types/models/question";
import { QuestionComplexity } from "@/@types/models/question";
import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import { transformQuestionComplexity } from "@/utils/question";

class QuestionService {
  static async addQuestion({
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
    if (typeof window === "undefined") {
      return;
    }

    try {
      QuestionService.validateAddQuestion({
        title,
        description,
        complexity,
        categories,
      });

      await authorizedAxios.post(BE_API.questions.root, {
        title, description, difficulty: transformQuestionComplexity(complexity), topics: categories
      })
    } catch (err) {
      throw err;
    }
  }

  static async removeQuestion({ id }: { id: number }) {
    if (typeof window === "undefined") {
      return;
    }

    await authorizedAxios.delete(BE_API.questions.root, {
      params: {
        id
      }
    })
  }

  static async editQuestion(questionData: Question) {
    if (typeof window === "undefined") {
      return;
    }

    try {
      QuestionService.validateAddQuestion(questionData);
      const { id, title, complexity, categories, description } = questionData
      await authorizedAxios.patch(BE_API.questions.root, {
        title, complexity, categories, description
      }, {
        params: {
          id
        }
      })
    } catch (err) {
      throw err;
    }
  }

  static async getQuestions() {
    if (typeof window === "undefined") {
      return [];
    }

    const questions = await authorizedAxios.get(BE_API.questions.root) as Question[]
    return questions
  }

  static async getQuestion(id: number) {
    return await authorizedAxios.get(BE_API.questions.root, {
      params: {
        id
      }
    })
  }

  // TODO: add validation from backend question service
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
      throw new Error("Missing title field.");
    }
    if (!description) {
      throw new Error("Missing description field.");
    }

    if (!complexity) {
      throw new Error("Missing complexity field.");
    }

    if (!categories || categories.length === 0) {
      throw new Error("Missing categories field.");
    }

    // check if duplicate exists
    // const questions = this.getQuestions();
    // const isDuplicate =
    //   questions
    //     .filter(
    //       (q) =>
    //         q.title === title &&
    //         q.description === description &&
    //         q.complexity === complexity &&
    //         q.categories.length === categories.length,
    //     )
    //     .filter((q) => {
    //       let setOfCategories = new Set([...categories]);
    //       q.categories.forEach((cat) => {
    //         if (!setOfCategories.has(cat)) {
    //           return false;
    //         }
    //       });

    //       return true;
    //     }).length > 0;

    // if (isDuplicate) {
    //   throw new Error("Exact question already exists. No change detected.");
    // }

    return true;
  }
}

export default QuestionService;
