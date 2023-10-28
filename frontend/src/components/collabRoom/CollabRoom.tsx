// pages/CollabRoom.tsx
import React, { useState, createContext, FunctionComponent } from "react";
import { Box } from "@chakra-ui/react";
import Splitter from "@devbookhq/splitter";
import CodeEditor from "./CodeEditor";
import QuestionDescription from "./QuestionDescription";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Question } from "@/@types/models/question";
import { User } from "@/@types/user";

interface Attempt {
  attemptId: number;
  codeText: string;
  questionId: string;
}

interface CollabRoomProps {
  questionTotalList: Question[];
  languageTotalList: string[];
  listOfAttempts: Attempt[];
  listOfActiveUsers: User[];
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: (questionId: string) => void;
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string) => void;
}

interface CollabContextValue {
  state: {
    questionTotalList: Question[];
    languageTotalList: string[];
    listOfAttempts: Attempt[];
    listOfActiveUsers: User[];
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      questionTotalList: Question[];
      languageTotalList: string[];
      listOfAttempts: Attempt[];
      listOfActiveUsers: User[];
    }>
  >;
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: (questionId: string) => void; // karwi: initial selected qn
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
}

interface CurrentAttemptContextValue {
  currentAttempt: Attempt | null;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}

export const CollabContext = createContext<CollabContextValue | null>(null);
export const CurrentAttemptContext = createContext<CurrentAttemptContextValue | null>(null);

const CollabRoom: FunctionComponent<CollabRoomProps> = ({
  questionTotalList,
  languageTotalList,
  listOfAttempts,
  listOfActiveUsers,
  onDeleteAttempt,
  onCloseRoom,
  onNewAttempt,
  onCodeChange,
  onQuestionChange,
}) => {
  const [state, setState] = useState({
    questionTotalList,
    languageTotalList,
    listOfAttempts,
    listOfActiveUsers,
  });
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);

  return (
    <CollabContext.Provider
      value={{
        state,
        setState,
        onDeleteAttempt,
        onCloseRoom,
        onNewAttempt,
        onCodeChange,
        onQuestionChange,
      }}
    >
      <CurrentAttemptContext.Provider value={{ currentAttempt, setCurrentAttempt }}>
        <Box>
          <TopBar />
          <Splitter>
            <CodeEditor />
            <QuestionDescription />
          </Splitter>
          <BottomBar />
        </Box>
      </CurrentAttemptContext.Provider>
    </CollabContext.Provider>
  );
};

export default CollabRoom;
