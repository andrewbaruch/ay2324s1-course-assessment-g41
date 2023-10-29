"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = __importDefault(require("../clients/pubsub"));
const matching_request_1 = require("../constants/matching-request");
class ComplexityMatchingPushService {
    constructor() {
        this.pubSubClient = new pubsub_1.default();
    }
    pushMatchingRequest(userId, questionComplexity) {
        const data = JSON.stringify({
            userId,
            questionComplexity,
            time: new Date().getTime(),
        });
        this.publishToTopic(matching_request_1.MATCHING_REQUEST_TOPIC_PUBLISH, data);
    }
    publishToTopic(topic, data) {
        this.pubSubClient.publishToTopic(topic, data);
    }
}
exports.default = ComplexityMatchingPushService;
