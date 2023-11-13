"use client";

// pages/CollabRoomContainer.tsx
import React, { useMemo } from "react";
import CollabRoom from "@/components/collabRoom/CollabRoom";
import { CodeEditor } from "@/views/codeEditor";
import { useDocumentProvider } from "@/hooks/room/useDocumentProvider";
import { VideoContextProvider } from "@/contexts/VideoContext";
import useRoomAccess from "@/hooks/guards/useRoomAccess";
import { HocuspocusProvider } from "@hocuspocus/provider";
import useManageAttempt from "@/hooks/collab-room/useManageCurrentAttempt";
import useManageCodingLanguages from "@/hooks/collab-room/useManageCodingLanguages";
import useManageUsersInRoom from "@/hooks/collab-room/useManageUsersInRoom";
import { useMatchingContext } from "@/contexts/MatchingContext";
import useManageQuestionsInRoom from "@/hooks/collab-room/useManageQuestions";
import { useRouter } from "next/navigation";

interface CollabRoomContainerProps {
  params: { id: string };
}

// Usage
const CollabRoomContainer: React.FC<CollabRoomContainerProps> = ({ params }) => {
  const { id } = params;

  useRoomAccess(id);
  const router = useRouter();

  const handleClose = (provider: HocuspocusProvider | null) => {
    if (!provider) return;
    console.log("disconnecting provider");
    provider.disconnect();
    router.push("/dashboard");
  };

  const { handleEditorMount, provider, document } = useDocumentProvider({ roomName: id });
  const { activeUsers } = useManageUsersInRoom({ provider });
  const { currentAttempt, listOfSavedAttempts, createNewAttempt, toggleToAttempt, saveAttempt } =
    useManageAttempt({ document, provider, roomName: id });
  const { supportedLanguages, handleLanguageChange } = useManageCodingLanguages({ document });
  const { complexity } = useMatchingContext();
  const { filteredQuestions, handleQuestionChange } = useManageQuestionsInRoom({
    complexity,
    document,
  });

  return (
    <VideoContextProvider roomId={id}>
      <CollabRoom
        questionTotalList={filteredQuestions}
        languageTotalList={supportedLanguages}
        listOfAttempts={listOfSavedAttempts}
        listOfActiveUsers={activeUsers}
        currentAttempt={currentAttempt}
        onSaveAttempt={saveAttempt}
        onCloseRoom={() => handleClose(provider)}
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