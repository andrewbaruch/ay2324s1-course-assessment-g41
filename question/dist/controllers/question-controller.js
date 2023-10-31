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
exports.deleteQuestion = exports.updateQuestion = exports.getFilteredQuestions = exports.getQuestionById = exports.createQuestion = void 0;
const question_1 = require("../models/question");
const question_service_1 = require("../services/question-service");
const questionService = new question_service_1.QuestionService();
function createQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newQuestion = req.body;
            yield questionService.createQuestion(newQuestion);
            res.status(201).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.createQuestion = createQuestion;
function getQuestionById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const question = yield questionService.getQuestionById(id);
            if (question) {
                res.json(question);
            }
            else {
                res.status(404).send();
            }
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getQuestionById = getQuestionById;
function getFilteredQuestions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { difficulties, sorting } = req.query;
            let difficultiesEnumArray = [];
            if (difficulties && typeof difficulties === 'string') {
                difficultiesEnumArray = difficulties
                    .split(',')
                    .map(d => parseInt(d, 10))
                    .filter(d => !isNaN(d) && Object.values(question_1.Difficulty).includes(d))
                    .map(d => d);
            }
            else {
                // get all questions
                difficultiesEnumArray = Object.values(question_1.Difficulty).map(d => d);
            }
            const sort = (sorting === 'asc' || sorting === 'desc') ? sorting : 'nil';
            const sortedQuestions = yield questionService.getFilteredQuestions(difficultiesEnumArray, sort);
            res.json(sortedQuestions);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });
}
exports.getFilteredQuestions = getFilteredQuestions;
function updateQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const update = req.body;
            const updatedQuestion = yield questionService.updateQuestion(id, update);
            if (updatedQuestion) {
                res.json(updatedQuestion);
            }
            else {
                res.status(404).send('Question not found');
            }
        }
        catch (error) {
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.updateQuestion = updateQuestion;
function deleteQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const deleted = yield questionService.deleteQuestion(id);
            if (deleted) {
                res.status(204).send();
            }
            else {
                res.status(404).send();
            }
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.deleteQuestion = deleteQuestion;
