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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const mongo_1 = require("../clients/mongo");
const mongodb_1 = require("mongodb");
class QuestionService {
    constructor() {
        this.collectionName = 'questions';
        this.dbClient = new mongo_1.MongoDBClient();
        this.dbClient.connect();
    }
    createQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedQuestion = yield this.dbClient.insertOne(this.collectionName, question);
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
            const filter = { difficulty: { $in: difficulties } };
            const questions = yield this.dbClient.find(this.collectionName, filter);
            if (sorting === 'asc') {
                questions.sort((a, b) => a.difficulty - b.difficulty);
            }
            else if (sorting === 'desc') {
                questions.sort((a, b) => b.difficulty - a.difficulty);
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
exports.QuestionService = QuestionService;
