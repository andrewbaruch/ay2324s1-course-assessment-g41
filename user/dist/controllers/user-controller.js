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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getCurrentUser = exports.createUser = void 0;
const user_service_1 = __importDefault(require("../services/user-service"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = req.body;
        try {
            yield user_service_1.default.create(newUser);
            res.status(200);
        }
        catch (error) {
            res.status(500);
        }
    });
}
exports.createUser = createUser;
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        res.status(200).json("success");
        return;
        try {
            const user = yield user_service_1.default.read(userId);
            if (user) {
                res.status(200).json(user);
            }
        }
        catch (error) {
            res.status(500);
        }
    });
}
exports.getCurrentUser = getCurrentUser;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        try {
            res.status(200).json('hi');
            const user = yield user_service_1.default.read(userId);
            if (user) {
                res.status(200).json(user);
            }
        }
        catch (error) {
            res.status(500);
        }
    });
}
exports.getUserById = getUserById;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const updatedUser = req.body; // Partial to allow updating only specific fields
        try {
            yield user_service_1.default.update(userId, updatedUser);
            res.status(200);
        }
        catch (error) {
            res.status(500);
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        try {
            yield user_service_1.default.delete(userId);
            res.status(200);
        }
        catch (error) {
            res.status(500);
        }
    });
}
exports.deleteUser = deleteUser;
