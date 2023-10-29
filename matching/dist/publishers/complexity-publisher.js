"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = __importDefault(require("../clients/pubsub"));
class ComplexityPublisher {
    constructor() {
        this.pubSubClient = new pubsub_1.default();
    }
    publishToTopic(topic, data) {
        this.pubSubClient.publishToTopic(topic, data);
    }
}
exports.default = ComplexityPublisher;
