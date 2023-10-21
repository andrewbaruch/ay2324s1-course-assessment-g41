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
exports.getMatchingStatusWithoutParams = exports.getMatchingStatus = void 0;
// import matchingService from "../services/matching-service";
const matchingRequestCache_1 = __importDefault(require("../matchingRequestCache"));
const matchingPairCache_1 = __importDefault(require("../matchingPairCache"));
function getMatchingStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: pull data from db
        const userId = req.params.id;
        console.log("in be get matching wohooasdasd, userid=", userId);
        const matchingPair = matchingPairCache_1.default.get(userId);
        console.log("in be get matching wohooasdasd, matchingPair=", matchingPair);
        var status = matchingRequestCache_1.default.get(userId);
        console.log("in be get matching wohooasdasd, status=", status);
        if (matchingPair != undefined) {
            const roomId = matchingPair.roomId;
            res.status(200).json(roomId);
        }
        else if (status !== undefined) {
            res.status(202).send();
        }
        else if (status === undefined) {
            res.status(404).send();
        }
        // status = 1;
        // if (status == 1) {
        //   res.status(200).json(roomId);
        // } else if (status == 2) {
        //   res.status(202).send();
        // } else if (status == 0) {
        //   res.status(404).send();
        // }
    });
}
exports.getMatchingStatus = getMatchingStatus;
function getMatchingStatusWithoutParams(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: pull data from db
        // const userId = req.params.id;
        console.log("in be get matching without param, userid");
        const status = 1;
        if (status == 1) {
            const roomId = 18263;
            res.status(200).json(roomId);
        }
        else if (status == 2) {
            res.status(202).send();
        }
        else if (status == 0) {
            res.status(404).send();
        }
    });
}
exports.getMatchingStatusWithoutParams = getMatchingStatusWithoutParams;
