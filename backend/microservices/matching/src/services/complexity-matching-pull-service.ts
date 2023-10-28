import { MATCHING_REQUEST_VALID_DURATION_IN_SECONDS } from "@/constants/matching-request";
import * as CollabClient from "@/clients/collab-client"

class ComplexityMatchingPullService {
  readonly matchingPairs: Record<string, string> = {};
  readonly dequeuedPairs: Record<string, any[]> = {
    Easy: [],
    Medium: [],
    Hard: [],
  };

  public isUserAlreadyMatched(userId: string) {
    return userId in this.matchingPairs
  }

  public registerRequestForMatch(requestForMatchData: any) {
    const complexity: string = requestForMatchData.questionComplexity;
    this.dequeuedPairs[complexity].push(requestForMatchData);
    return complexity
  }

  public removeExpiredRequestsOfComplexity(complexity: string) {
    const currentTime: number = new Date().getTime();
    while (this.dequeuedPairs[complexity].length != 0) {
      console.log(
        `time ${(currentTime - this.dequeuedPairs[complexity][0].time) / 1000}`
      );

      if ((currentTime - this.dequeuedPairs[complexity][0].time) / 1000 <= MATCHING_REQUEST_VALID_DURATION_IN_SECONDS) {
        break;
      }

      this.dequeuedPairs[complexity].shift();
    }
  }

  public async retrieveRoomId(userId1: string, userId2: string) {
    return await CollabClient.createRoom(userId1, userId2)
  }

  public async matchUsersIfMoreThanTwo(complexity: string) {
    if (this.dequeuedPairs[complexity].length < 2) {
      return {
        roomId: null,
        user1: null,
        user2: null
      };
    }

    // If more than 2 messages already
    // get 2 users
    const user1: any = this.dequeuedPairs[complexity].shift();
    const user2: any = this.dequeuedPairs[complexity].shift();

    // send to matching topic, store matching pair
    const matchingTopicData: string = JSON.stringify({
      userId1: user1.userId,
      userId2: user2.userId,
      complexity: complexity,
    });

    this.matchingPairs[user1.userId] = user2.userId;
    this.matchingPairs[user2.userId] = user1.userId;

    // TODO: call collab service here to get room id, replace "Dummyroom" with roomid below
    const room = await this.retrieveRoomId(user1.userId, user2.userId)

    console.log(`user1=${user1.userId}, user2=${user2.userId}`);
    console.log(`myData=${matchingTopicData} `);
    return {
      user1,
      user2,
      room,
    }
  
  }
}

export default ComplexityMatchingPullService;
