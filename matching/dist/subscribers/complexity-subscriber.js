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
const pubsub_1 = __importDefault(require("../clients/pubsub"));
const matching_request_1 = require("../constants/matching-request");
const complexity_matching_pull_service_1 = __importDefault(require("../services/complexity-matching-pull-service"));
const complexity_matching_pair_cache_1 = __importDefault(require("../utils/complexity-matching-pair-cache"));
const complexity_matching_request_cache_1 = __importDefault(require("../utils/complexity-matching-request-cache"));
/**
 * Listener that "pulls" messages from Google PubSub on the question complexity topic.
 */
class ComplexitySubscriber {
    constructor() {
        this.pubSubClient = new pubsub_1.default();
        this.complexityMatchingPullService = new complexity_matching_pull_service_1.default();
    }
    start() {
        complexity_matching_request_cache_1.default.flushAll();
        complexity_matching_pair_cache_1.default.flushAll();
        this.pubSubClient.subscribeToTopic(matching_request_1.MATCHING_REQUEST_TOPIC_SUBSCRIPTION, (message) => this.handleMessage(message, this.complexityMatchingPullService));
    }
    handleMessage(message, complexityMatchingPullService) {
        return __awaiter(this, void 0, void 0, function* () {
            message.ack();
            try {
                console.log("=======================================");
                console.log(complexity_matching_request_cache_1.default.keys());
                console.log(complexity_matching_pair_cache_1.default.keys());
                console.log("=======================================");
                console.log(`Received message ${message.id}:`);
                console.log(`\tData: ${message.data}`);
                console.log(`\tAttributes: ${message.attributes}`);
                const parsedData = JSON.parse(message.data.toString());
                console.log(`parsedData`, parsedData);
                if (complexityMatchingPullService.isUserAlreadyMatched(parsedData.userId || parsedData.user))
                    return;
                const complexity = complexityMatchingPullService.registerRequestForMatch(parsedData);
                // add to request cache
                complexity_matching_request_cache_1.default.set(parsedData.userId || parsedData.user, { complexity: complexity }, matching_request_1.MATCHING_REQUEST_VALID_DURATION_IN_SECONDS);
                complexityMatchingPullService.removeExpiredRequestsOfComplexity(complexity);
                const { roomId, user1, user2 } = yield complexityMatchingPullService.matchUsersIfMoreThanTwo(complexity);
                if (roomId) {
                    // update matchingPairCache
                    console.log("matched pair, inserting into cache", complexity_matching_pair_cache_1.default.set(user1.userId, {
                        userId2: user2.userId,
                        complexity: complexity,
                        roomId: roomId,
                    }), complexity_matching_pair_cache_1.default.set(user2.userId, {
                        userId2: user1.userId,
                        complexity: complexity,
                        roomId: roomId,
                    }));
                }
                console.log(`matchingpairs=${JSON.stringify(complexityMatchingPullService.matchingPairs)}`);
            }
            catch (err) {
                console.error(`message ${message.id} has an error:`, err);
            }
        });
    }
}
exports.default = ComplexitySubscriber;
