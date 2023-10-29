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
exports.getMatchingStatusWithoutParams = exports.getMatchingStatus = exports.pushMatchRequestToQueue = void 0;
const complexity_matching_request_cache_1 = __importDefault(require("../utils/complexity-matching-request-cache"));
const complexity_matching_pair_cache_1 = __importDefault(require("../utils/complexity-matching-pair-cache"));
const status_1 = require("../models/status");
const complexity_matching_push_service_1 = __importDefault(require("../services/complexity-matching-push-service"));
const pushMatchRequestToQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: @didy refator to use jwt token and auth service
    const { userId, questionComplexity } = req.body;
    const complexityPublisherService = new complexity_matching_push_service_1.default();
    try {
        complexityPublisherService.pushMatchingRequest(userId, questionComplexity);
    }
    catch (err) {
        // TODO: add better error validation
        res.status(400).send();
    }
    res.status(200).send();
});
exports.pushMatchRequestToQueue = pushMatchRequestToQueue;
function getMatchingStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: pull data from db
        const userId = req.params.id;
        // console.log(
        //   "in be get matching, matching keys=",
        //   matchingRequestCache.keys()
        // );
        // console.log(
        //   "in be get matching, pair keys=",
        //   matchingPairCache.keys()
        // );
        // console.log("in be get matching, userid=", userId);
        const matchingPair = complexity_matching_pair_cache_1.default.get(userId);
        // console.log("in be get matching, matchingPair=", matchingPair);
        var status = complexity_matching_request_cache_1.default.get(userId);
        // console.log("in be get matching, status=", status);
        if (matchingPair !== undefined) {
            const roomId = matchingPair.roomId;
            res.status(200).json({ roomId, status: status_1.Status.paired });
        }
        else if (status !== undefined) {
            res.status(200).json({ status: status_1.Status.processing });
        }
        else if (status === undefined) {
            res.status(200).json({ status: status_1.Status.expired });
        }
    });
}
exports.getMatchingStatus = getMatchingStatus;
function getMatchingStatusWithoutParams(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("in be get matching without param");
        const status = 1;
        if (status == 1) {
            const roomId = 18263;
            res.status(200).json(roomId);
        }
        else if (status == 2) {
            res.status(202).send();
        }
        else if (status == 0) {
            res.status(204).send();
        }
    });
}
exports.getMatchingStatusWithoutParams = getMatchingStatusWithoutParams;
