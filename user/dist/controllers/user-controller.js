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
exports.deleteTopics = exports.addTopics = exports.updateTopics = exports.readCurrentTopics = exports.getTopics = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getCurrentUser = void 0;
const user_service_1 = __importDefault(require("../services/user-service"));
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        try {
            const user = yield user_service_1.default.read(userId);
            if (user) {
                res.status(200).json(user);
            }
            res.status(404).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getCurrentUser = getCurrentUser;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        try {
            const user = yield user_service_1.default.read(userId);
            if (user) {
                res.status(200).json(user);
            }
            res.status(404).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getUserById = getUserById;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        const updatedUser = req.body; // Partial to allow updating only specific fields
        try {
            yield user_service_1.default.update(userId, updatedUser);
            res.status(200).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        try {
            yield user_service_1.default.delete(userId);
            res.status(200).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.deleteUser = deleteUser;
function getTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        try {
            const topics = yield user_service_1.default.readTopics(userId);
            res.status(200).json(topics);
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.getTopics = getTopics;
function readCurrentTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        try {
            const topics = yield user_service_1.default.readTopics(userId);
            res.status(200).json(topics);
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.readCurrentTopics = readCurrentTopics;
function updateTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        const topics = req.body;
        try {
            yield user_service_1.default.updateTopics(userId, topics);
            res.status(200).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.updateTopics = updateTopics;
function addTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        const topics = req.body;
        try {
            yield user_service_1.default.addTopics(userId, topics);
            res.status(200).send();
        }
        catch (error) {
            res.status(500).send();
        }
    });
}
exports.addTopics = addTopics;
function deleteTopics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        const topicsParam = req.query.topics;
        if (topicsParam) {
            const topics = topicsParam.split(',');
            try {
                yield user_service_1.default.deleteTopics(userId, topics);
                res.status(200).send();
            }
            catch (error) {
                res.status(500).send();
            }
        }
        res.status(401).send();
    });
}
exports.deleteTopics = deleteTopics;
