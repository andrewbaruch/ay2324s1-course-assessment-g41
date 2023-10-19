"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../clients/mongo"));
const mongodb_1 = require("mongodb");
// interface QuestionSchema {
//   _id: ObjectId;
//   title: string;
//   description: string;
//   category: string;
//   complexity: Complexity;
// }
class QuestionService {
    constructor() {
        this.collectionName = 'questions';
        this.dbClient = new mongo_1.default();
    }
    createQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedQuestion = yield this.dbClient.insertOne(this.collectionName, question);
            yield this.dbClient.disconnect();
            return insertedQuestion;
        });
    }
    getQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(id) };
            const question = yield this.dbClient.findOne(this.collectionName, filter);
            return question;
        });
    }
    getFilteredQuestions(difficulties, sorting) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { complexity: { $in: difficulties } };
            const questions = yield this.dbClient.find(this.collectionName, filter);
            if (sorting === 'asc') {
                questions.sort((a, b) => a.complexity - b.complexity);
            }
            else if (sorting === 'desc') {
                questions.sort((a, b) => b.complexity - a.complexity);
            }
            return questions;
        });
    }
    updateQuestion(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(id) };
            const updatedQuestion = yield this.dbClient.updateOne(this.collectionName, filter, update);
            return updatedQuestion;
        });
    }
    deleteQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(id) };
            const deleteResult = yield this.dbClient.deleteOne(this.collectionName, filter);
            return deleteResult.deletedCount === 1;
        });
    }
}
exports.default = QuestionService;
