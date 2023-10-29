"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("@google-cloud/pubsub");
class PubSubClient {
    constructor() {
        this.client = new pubsub_1.PubSub();
    }
    subscribeToTopic(topic, messageHandler) {
        const subscription = this.client.subscription(topic);
        subscription.on("message", messageHandler);
    }
    publishToTopic(topic, data) {
        this.client.topic(topic).publishMessage({
            data: Buffer.from(data)
        });
    }
}
exports.default = PubSubClient;
