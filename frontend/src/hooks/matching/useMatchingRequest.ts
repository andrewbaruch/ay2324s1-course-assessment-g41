import { QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";
import MatchingService from "@/services/matchingService";
import { use } from "react";

export const useMatching = () => {
  // function startPolling(callApiFn, testFn, doFn, time) {
  //   let intervalId = setInterval(() => {
  //     callApiFn()
  //       .then((data) => {
  //         if (intervalId && testFn(data)) {

  //           stopPolling();
  //           doFn(data);
  //         }
  //       })
  //       .catch((e) => {
  //         stopPolling();
  //         throw new Error("Polling cancelled due to API error");
  //       });
  //   }, time);

  //   function stopPolling() {
  //     if (intervalId) {
  //       console.log(new Date(), "Stopping polling...");
  //       clearInterval(intervalId);
  //       intervalId = null;
  //     } else {
  //       console.log(new Date(), "Polling was already stopped...");
  //     }
  //   }

  //   return stopPolling;
  // }

  const sendMatchingRequest = (user: String, complexity: QuestionComplexity) => {
    MatchingService.setUpPairCoding(user, complexity);
  };

  const getMatchingStatus = (user: String) => {
    return MatchingService.getMatchingStatus(user);
  };

  return {
    sendMatchingRequest,
    getMatchingStatus,
  };
};
