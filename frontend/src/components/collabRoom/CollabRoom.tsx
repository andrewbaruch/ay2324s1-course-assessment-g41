// pages/CollabRoom.tsx
import React, { useState, useContext, createContext, FunctionComponent } from "react";
import { Box } from "@chakra-ui/react";
import Splitter from "@devbookhq/splitter";
import CodeEditor from "./CodeEditor";
import TabView from "./TabView";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { User } from "@/@types/user";
import { Question } from "@/@types/models/question";

interface Attempt {
  attemptId: number;
  codeText: string;
  questionId: number;
}

interface CollabRoomProps {
  // karwi: current code editor text. remove?
  codeEditorText: string;
  questionTotalList: Array<Question>;
  languageTotalList: Array<string>;
  listOfAttempts: Array<Attempt>;
  listOfActiveUsers: Array<User>;
}

interface CollabContextValue {
  state: {
    codeEditorText: string;
    questionTotalList: Array<Question>;
    languageTotalList: Array<string>;
    listOfAttempts: Array<Attempt>;
    listOfActiveUsers: Array<User>;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      codeEditorText: string;
      questionTotalList: Array<Question>;
      languageTotalList: Array<string>;
      listOfAttempts: Array<Attempt>;
      listOfActiveUsers: Array<User>;
    }>
  >;
}

export const CollabContext = createContext<CollabContextValue | null>(null);

const CollabRoom: FunctionComponent<CollabRoomProps> = ({
  codeEditorText,
  questionTotalList,
  languageTotalList,
  listOfAttempts,
  listOfActiveUsers,
}) => {
  const [state, setState] = useState({
    codeEditorText,
    questionTotalList,
    languageTotalList,
    listOfAttempts,
    listOfActiveUsers,
  });

  return (
    <CollabContext.Provider value={{ state, setState }}>
      <Box>
        <TopBar />
        <Splitter>
          <CodeEditor />
          <TabView />
        </Splitter>
        <BottomBar />
      </Box>
    </CollabContext.Provider>
  );
};

export default CollabRoom;
