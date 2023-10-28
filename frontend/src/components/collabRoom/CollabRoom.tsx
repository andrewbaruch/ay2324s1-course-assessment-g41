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
import { Language } from "@/@types/language";
import { Attempt } from "@/@types/attempt";

interface CollabRoomProps {
  questionTotalList: Question[];
  languageTotalList: Language[];
  listOfAttempts: Attempt[];
  listOfActiveUsers: User[];
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: (questionId: string) => void;
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
  onLanguageChange: (newLanguageId: string, attemptId: number) => void;
}

interface CollabContextValue {
  state: {
    questionTotalList: Question[];
    languageTotalList: Language[];
    listOfAttempts: Attempt[];
    listOfActiveUsers: User[];
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      questionTotalList: Question[];
      languageTotalList: Language[];
      listOfAttempts: Attempt[];
      listOfActiveUsers: User[];
    }>
  >;
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: (questionId: string) => void;
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
  onLanguageChange: (newLanguageId: string, attemptId: number) => void;
}

// karwi: consolidate contexts
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
  onLanguageChange,
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
        onLanguageChange,
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
