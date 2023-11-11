"use client";

// pages/CollabRoomContainer.tsx
import React, { useMemo } from "react";
import { Question, QuestionComplexity } from "@/@types/models/question";
import CollabRoom from "@/components/collabRoom/CollabRoom";
import { CodeEditor } from "@/views/codeEditor";
import { useDocumentProvider } from "@/hooks/room/useDocumentProvider";
import { VideoContextProvider } from "@/contexts/VideoContext";
import { WebSocketSignalingClient } from "@/videoClients/default";
import useRoomAccess from "@/hooks/guards/useRoomAccess";
import { HOST_WEBSOCKET_API } from "@/config";
import { BE_API } from "@/utils/api";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { closeRoom } from "@/services/room";
import useManageAttempt from "@/hooks/collab-room/useManageCurrentAttempt";
import useManageCodingLanguages from "@/hooks/collab-room/useManageCodingLanguages";
import useManageUsersInRoom from "@/hooks/collab-room/useManageUsersInRoom";
import { useMatchingContext } from "@/contexts/MatchingContext";
import useManageQuestionsInRoom from "@/hooks/collab-room/useManageQuestions";

// Mock Data
// const mockQuestions: Question[] = [
//   {
//     title: "FizzBuzz",
//     id: "1",
//     description:
//       "Write a program that prints the numbers from 1 to 100. But for multiples of three print `Fizz` instead of the number and for the multiples of five print `Buzz`. For numbers which are multiples of both three and five print `FizzBuzz`. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz.",
//     categories: ["Array", "String"],
//     complexity: QuestionComplexity.EASY,
//   },
//   {
//     title: "Reverse String",
//     id: "2",
//     description:
//       "Write a function that reverses a string. The input string is given as an array of characters `s`.",
//     categories: ["String"],
//     complexity: QuestionComplexity.EASY,
//   },
//   {
//     title: "Two Sum",
//     id: "3",
//     description:
//       "Given an array of integers `nums` and an integer `target`, return _indices_ of the two numbers such that they add up to `target`.",
//     categories: ["Array", "Hash Table"],
//     complexity: QuestionComplexity.MEDIUM,
//   },
//   // ... other questions
// ];

// Mock Handlers
const handleDeleteAttempt = (attemptId: number) => {
  console.log(`Delete attempt with id ${attemptId}`);
};

const handleCloseRoom = async (yProvider: HocuspocusProvider | null, roomName: string) => {
  console.log("Close room");
  if (!yProvider) return;
  yProvider.disconnect()
  await closeRoom(roomName);
};

// const handleQuestionChange = (newQuestionId: string, attemptId: number) => {
//   console.log(`Question change for attempt id ${attemptId}: ${newQuestionId}`);
// };

interface CollabRoomContainerProps {
  params: { id: string };
}

// Usage
const CollabRoomContainer: React.FC<CollabRoomContainerProps> = ({ params }) => {
  const { id } = params;

  useRoomAccess(id);

  const { handleEditorMount, provider, document } = useDocumentProvider({ roomName: id });
  const { activeUsers } = useManageUsersInRoom({ provider })
  const { currentAttempt, listOfSavedAttempts, createNewAttempt, toggleToAttempt } = useManageAttempt({ document, provider, roomName: id });
  const { supportedLanguages, handleLanguageChange } = useManageCodingLanguages({ document })
  const { complexity } = useMatchingContext();
  const { filteredQuestions, handleQuestionChange } = useManageQuestionsInRoom({ complexity, document });
  console.log('complexity', complexity, filteredQuestions);

  const signalingClient = useMemo(() => {
    const signalingUrl = `${HOST_WEBSOCKET_API}${BE_API.video.signaling}?roomId=${id}`;
    console.log("karwi: signalingUrl:", signalingUrl);
    return new WebSocketSignalingClient(signalingUrl);
  }, [id]);

  return (
    <VideoContextProvider signalingClient={signalingClient}>
      <CollabRoom
        questionTotalList={filteredQuestions}
        languageTotalList={supportedLanguages}
        listOfAttempts={listOfSavedAttempts}
        listOfActiveUsers={activeUsers}
        currentAttempt={currentAttempt}
        onDeleteAttempt={handleDeleteAttempt}
        onCloseRoom={() => handleCloseRoom(provider, id)}
        onNewAttempt={createNewAttempt}
        onQuestionChange={handleQuestionChange}
        onAttemptChange={toggleToAttempt}
        onLanguageChange={handleLanguageChange}
      >
        <CodeEditor document={document} provider={provider} onEditorMount={handleEditorMount} />
      </CollabRoom>
    </VideoContextProvider>
  );
};

export default CollabRoomContainer;
