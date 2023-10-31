// pages/CollabRoom.tsx
import React, {
  useState,
  createContext,
  FunctionComponent,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import * as Y from "yjs";
import { Box } from "@chakra-ui/react";
import Splitter, { GutterTheme } from "@devbookhq/splitter";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Question } from "@/@types/models/question";
import { User } from "@/@types/user";
import { Language } from "@/@types/language";
import { Attempt } from "@/@types/attempt";
import TabView from "./TabView";
import styles from "./Splitter.module.css";
import { useCodingLanguage } from "@/hooks/room/useCodingLanguage";
import { useRoom } from "@/hooks/room/useRoom";
import { useSharedDocument } from "@/hooks/room/useSharedDocument";
import { HocuspocusProvider } from "@hocuspocus/provider";

// karwi: better name?
interface CollabRoomPropsContextValue {
  questionTotalList: Question[];
  listOfAttempts: Attempt[];
  listOfActiveUsers: User[];
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: () => void;
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
  roomName: string;
}

type CollabRoomProps = CollabRoomPropsContextValue & {
  children: ReactNode;
};

interface CurrentAttemptContextValue {
  currentAttempt: Attempt | null;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
  languageTotalList: Language[];
  onLanguageChange: (newLanguageId: Language, attemptId: number) => void;
  handleEditorMount: (editor: any) => void;
  provider: HocuspocusProvider | null;
  document: Y.Doc | null;
}

type CollabContextValue = CollabRoomPropsContextValue & CurrentAttemptContextValue;

export const CollabContext = createContext<CollabContextValue | null>(null);

const CollabRoom: FunctionComponent<CollabRoomProps> = ({
  questionTotalList,
  listOfAttempts,
  listOfActiveUsers,
  onDeleteAttempt,
  onCloseRoom,
  onNewAttempt,
  onCodeChange,
  onQuestionChange,
  roomName,
  children,
}) => {
  const splitterSizesRef = useRef<number[]>([50, 50]); // assuming equal initial sizes for simplicity
  const {
    supportedLanguages: languageTotalList,
    changeLanguage: onLanguageChange,
    language,
  } = useCodingLanguage();
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const { handleEditorMount, provider, document } = useRoom({ roomName });
  const { sharedValue: sharedLanguage }: { sharedValue: { label: string; value: string } } =
    useSharedDocument({
      sharedKey: "language",
      valueToShare: language,
      document,
    });

  useEffect(() => {
    if (!currentAttempt) return;

    setCurrentAttempt({ ...currentAttempt, language: sharedLanguage });
  }, [sharedLanguage]);

  const handleResizeFinished = (pairIdx: number, newSizes: number[]) => {
    splitterSizesRef.current = newSizes;
  };

  return (
    <CollabContext.Provider
      value={{
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
        // others
        currentAttempt,
        setCurrentAttempt,
        handleEditorMount,
        provider,
        document,
        roomName
      }}
    >
      <Box>
        <TopBar />
        <Splitter
          gutterTheme={GutterTheme.Light}
          gutterClassName={styles.splitterContainer}
          initialSizes={splitterSizesRef.current}
          onResizeFinished={handleResizeFinished}
        >
          {children}
          <TabView />
        </Splitter>
        <BottomBar />
      </Box>
    </CollabContext.Provider>
  );
};

export default CollabRoom;
