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
exports.deleteQuestion = exports.updateQuestion = exports.getFilteredQuestions = exports.getQuestionById = exports.createQuestion = void 0;
const question_service_1 = __importDefault(require("../services/question-service"));
const questionService = new question_service_1.default();
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
        }
        catch (error) {
            res.status(500).send();
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
