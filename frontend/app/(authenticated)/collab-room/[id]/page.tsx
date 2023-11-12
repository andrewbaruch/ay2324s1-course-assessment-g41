"use client";

// pages/CollabRoomContainer.tsx
import React, { useMemo } from "react";
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
