"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const matching_request_1 = require("../constants/matching-request");
const CollabClient = __importStar(require("../clients/collab-client"));
class ComplexityMatchingPullService {
    constructor() {
        this.matchingPairs = {};
        this.dequeuedPairs = {
            Easy: [],
            Medium: [],
            Hard: [],
        };
    }
    isUserAlreadyMatched(userId) {
        return userId in this.matchingPairs;
    }
    registerRequestForMatch(requestForMatchData) {
        const complexity = requestForMatchData.questionComplexity;
        this.dequeuedPairs[complexity].push(requestForMatchData);
        return complexity;
    }
    removeExpiredRequestsOfComplexity(complexity) {
        const currentTime = new Date().getTime();
        while (this.dequeuedPairs[complexity].length != 0) {
            console.log(`time ${(currentTime - this.dequeuedPairs[complexity][0].time) / 1000}`);
            if ((currentTime - this.dequeuedPairs[complexity][0].time) / 1000 <= matching_request_1.MATCHING_REQUEST_VALID_DURATION_IN_SECONDS) {
                break;
            }
            this.dequeuedPairs[complexity].shift();
        }
    }
    retrieveRoomId(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CollabClient.createRoom(userId1, userId2);
        });
    }
    matchUsersIfMoreThanTwo(complexity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dequeuedPairs[complexity].length < 2) {
                return {
                    roomId: null,
                    user1: null,
                    user2: null
                };
            }
            // If more than 2 messages already
            // get 2 users
            const user1 = this.dequeuedPairs[complexity].shift();
            const user2 = this.dequeuedPairs[complexity].shift();
            // send to matching topic, store matching pair
            const matchingTopicData = JSON.stringify({
                userId1: user1.userId,
                userId2: user2.userId,
                complexity: complexity,
            });
            this.matchingPairs[user1.userId] = user2.userId;
            this.matchingPairs[user2.userId] = user1.userId;
            // TODO: call collab service here to get room id, replace "Dummyroom" with roomid below
            const roomId = yield this.retrieveRoomId(user1.userId, user2.userId);
            console.log(`user1=${user1.userId} user2=${user2.userId}`);
            console.log(`myData=${matchingTopicData} `);
            return {
                user1,
                user2,
                roomId
            };
        });
    }
}
exports.default = ComplexityMatchingPullService;
