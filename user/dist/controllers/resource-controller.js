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
exports.getLanguages = exports.getTopics = void 0;
const resource_service_1 = __importDefault(require("../services/resource-service"));
function getTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const topics = yield resource_service_1.default.getAllTopics();
            res.status(200).json(topics);
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getTopics = getTopics;
function getLanguages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const languages = yield resource_service_1.default.getAllLanguages();
            res.status(200).json(languages);
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getLanguages = getLanguages;
