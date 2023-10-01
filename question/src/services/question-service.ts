import MongoDBClient from '@/clients/mongo';
import { ObjectId } from 'mongodb';
import { Question, Complexity } from '@/models/question'

// interface QuestionSchema {
//   _id: ObjectId;
//   title: string;
//   description: string;
//   category: string;
//   complexity: Complexity;
// }

class QuestionService {
  private dbClient: MongoDBClient;
  private collectionName = 'questions'

  constructor() {
    this.dbClient = new MongoDBClient();
  }

  async createQuestion(question: Question): Promise<Question> {
    const insertedQuestion = await this.dbClient.insertOne(this.collectionName, question);
    await this.dbClient.disconnect();

    return insertedQuestion as Question;
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const filter  = { _id: new ObjectId(id) }
    const question = await this.dbClient.findOne(this.collectionName, filter);

    return question as Question;
  }

  async getFilteredQuestions(difficulties: Complexity[], sorting: 'asc' | 'desc' | 'nil'): Promise<Question[]> {
    const filter = { complexity: { $in: difficulties } };
    const questions = await this.dbClient.find(this.collectionName, filter);
  
    if (sorting === 'asc') {
      questions.sort((a, b) => a.complexity - b.complexity);
    } else if (sorting === 'desc') {
      questions.sort((a, b) => b.complexity - a.complexity);
    }
  
    return questions as Question[];
  }

  async updateQuestion(id: string, update: Partial<Question>): Promise<Question | null> {
    const filter = { _id: new ObjectId(id) };
    const updatedQuestion = await this.dbClient.updateOne(this.collectionName, filter, update);

    return updatedQuestion as Question;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const filter = { _id: new ObjectId(id) };
    const deleteResult = await this.dbClient.deleteOne(this.collectionName, filter);

    return deleteResult.deletedCount === 1;
  }
}

export default QuestionService;