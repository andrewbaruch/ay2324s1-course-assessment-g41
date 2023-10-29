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
exports.closeRoom = exports.createRoom = void 0;
const axios_1 = __importDefault(require("axios"));
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env;
const collabClient = axios_1.default.create({
    baseURL: COLLAB_SERVICE_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    }
});
const createRoom = (userId1, userId2) => __awaiter(void 0, void 0, void 0, function* () {
    yield collabClient.put(`/room/${1}`);
    return yield collabClient.post("/room", {
        userId1, userId2
    });
});
exports.createRoom = createRoom;
const closeRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    yield collabClient.put(`/${roomId}`);
});
exports.closeRoom = closeRoom;
