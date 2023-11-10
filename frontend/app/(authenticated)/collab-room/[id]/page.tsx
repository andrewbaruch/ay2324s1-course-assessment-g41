"use client";

// pages/CollabRoomContainer.tsx
import React, { useMemo } from "react";
import { Question, QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";
import CollabRoom from "@/components/collabRoom/CollabRoom";
import { Attempt } from "@/@types/attempt";
import { CodeEditor } from "@/views/codeEditor";
import { useDocumentProvider } from "@/hooks/room/useDocumentProvider";
import useGetCurrentAttempt from "@/hooks/collab-room/useGetCurrentAttempt";
import { useGetLanguages } from "@/hooks/room/useGetLanguages";
import { VideoContextProvider } from "@/contexts/VideoContext";
import { WebSocketSignalingClient } from "@/videoClients/default";
import useRoomAccess from "@/hooks/guards/useRoomAccess";
import { HOST_WEBSOCKET_API } from "@/config";
import { BE_API } from "@/utils/api";
import { Doc } from "yjs";
import { upsertDocumentValue } from "@/utils/document";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Language } from "@/@types/language";
import { usePushUsersInRoom, useGetUsersInRoom } from "@/hooks/room/useUsersInRoom";

// Mock Data
const mockQuestions: Question[] = [
  {
    title: "FizzBuzz",
    id: "1",
    description:
      "Write a program that prints the numbers from 1 to 100. But for multiples of three print `Fizz` instead of the number and for the multiples of five print `Buzz`. For numbers which are multiples of both three and five print `FizzBuzz`. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz. Write a program that prints the numbers from 1 to 100. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz.",
    categories: ["Array", "String"],
    complexity: QuestionComplexity.EASY,
  },
  {
    title: "Reverse String",
    id: "2",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`.",
    categories: ["String"],
    complexity: QuestionComplexity.EASY,
  },
  {
    title: "Two Sum",
    id: "3",
    description:
      "Given an array of integers `nums` and an integer `target`, return _indices_ of the two numbers such that they add up to `target`.",
    categories: ["Array", "Hash Table"],
    complexity: QuestionComplexity.MEDIUM,
  },
  // ... other questions
];

const mockAttempts: Attempt[] = [
  {
    attemptId: 1,
    question: mockQuestions[0],
    language: { label: "Plain Text", value: "plaintext" },
  },
  {
    attemptId: 2,
    question: mockQuestions[1],
    language: { label: "Plain Text", value: "plaintext" },
  },
  // ... other attempts
];

// Mock Handlers
const handleDeleteAttempt = (attemptId: number) => {
  console.log(`Delete attempt with id ${attemptId}`);
};

const handleCloseRoom = (yProvider: HocuspocusProvider | null) => {
  console.log("Close room");
  if (!yProvider) return;

  yProvider.disconnect()

};

const handleNewAttempt = (document: Doc | null, listOfAttempts: Attempt[]) => {
  upsertDocumentValue({
    sharedKey: "attemptId",
    valueToUpdate: listOfAttempts.length + 1,
    document
  })
};

const handleCodeChange = (newCodeText: string, attemptId: number) => {
  console.log(`Code change for attempt id ${attemptId}: ${newCodeText}`);
};

const handleQuestionChange = (newQuestionId: string, attemptId: number) => {
  console.log(`Question change for attempt id ${attemptId}: ${newQuestionId}`);
};

const handleAttemptChange = (newAttemptId: number) => {
  console.log(`Change attempt to ${newAttemptId}`);
};

const handleLanguageChange = (document: Doc | null, newLanguageValue: Language, attemptId: number) => {
  console.log(`Question change for attempt id ${attemptId}: ${newLanguageValue}`);
  upsertDocumentValue({
    sharedKey: "language",
    valueToUpdate: newLanguageValue,
    document
  })
};

interface CollabRoomContainerProps {
  params: { id: string };
}

// Usage
const CollabRoomContainer: React.FC<CollabRoomContainerProps> = ({ params }) => {
  const { id } = params;

  useRoomAccess(id);

  const { supportedLanguages } = useGetLanguages();

  const { handleEditorMount, provider, document } = useDocumentProvider({ roomName: id });

  const currentAttempt = useGetCurrentAttempt(document);
  usePushUsersInRoom({ provider })
  const { users: activeUsers } = useGetUsersInRoom({ provider })


  const signalingClient = useMemo(() => {
    const signalingUrl = `${HOST_WEBSOCKET_API}${BE_API.video.signaling}?roomId=${id}`;
    console.log("karwi: signalingUrl:", signalingUrl);
    return new WebSocketSignalingClient(signalingUrl);
  }, [id]);

  return (
    <VideoContextProvider signalingClient={signalingClient}>
      <CollabRoom
        questionTotalList={mockQuestions}
        languageTotalList={supportedLanguages}
        listOfAttempts={mockAttempts}
        listOfActiveUsers={activeUsers}
        currentAttempt={currentAttempt}
        onDeleteAttempt={handleDeleteAttempt}
        onCloseRoom={() => handleCloseRoom(provider)}
        onNewAttempt={() => handleNewAttempt(document, mockAttempts)}
        onCodeChange={handleCodeChange}
        onQuestionChange={handleQuestionChange}
        onAttemptChange={handleAttemptChange}
        onLanguageChange={(newLanguage: Language, attemptId: number) => handleLanguageChange(document, newLanguage, attemptId)}
      >
        <CodeEditor document={document} provider={provider} onEditorMount={handleEditorMount} />
      </CollabRoom>
    </VideoContextProvider>
  );
};

export default CollabRoomContainer;
