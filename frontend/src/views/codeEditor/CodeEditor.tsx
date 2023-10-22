import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Cursor } from "../../components/editor";
import { useRoom } from "@/hooks/room/useRoom";
import { useSharedDocument } from "@/hooks/room/useSharedDocument";
import { useCodingLanguage } from "@/hooks/room/useCodingLanguage";
import { Select } from "chakra-react-select";
import { Box, Stack, useColorMode } from "@chakra-ui/react";
import { codeEditorOptions, themifyCodeEditor } from "@/utils/codeEditor";

// loader.config({ monaco });
/**
 * Reference: https://liveblocks.io/examples/collaborative-code-editor/nextjs-yjs-monaco
 */
export const CodeEditor = () => {
  const { handleEditorMount, provider, document } = useRoom();
  const { language, changeLanguage, supportedLanguages } = useCodingLanguage();
  const { sharedValue: sharedLanguage }: { sharedValue: { label: string; value: string } } =
    useSharedDocument({
      sharedKey: "language",
      valueToShare: language,
      document,
    });
  const { colorMode } = useColorMode();

  useEffect(() => {
    return () => document?.destroy();
  }, []);

  return (
    <Stack>
      <Box w="fit-content" minW="300px">
        <Select
          value={sharedLanguage}
          options={supportedLanguages}
          onChange={(newValue) => changeLanguage(newValue as { label: string; value: string })}
        />
      </Box>
      {provider ? <Cursor yProvider={provider} /> : null}
      <Editor
        height="60vh"
        onMount={handleEditorMount}
        language={sharedLanguage.value}
        options={codeEditorOptions}
        theme={themifyCodeEditor(colorMode)}
      />
    </Stack>
  );
};
