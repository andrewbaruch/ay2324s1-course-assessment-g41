import { Editor } from "@monaco-editor/react";
import { Cursor } from "../../components/editor";
import { useRoom } from "@/hooks/room/useRoom";
import { useDocument } from '@/hooks/room/useCodeEditor';
import { Select } from 'chakra-react-select';
import { Box, Stack, useColorMode } from '@chakra-ui/react';
import { codeEditorOptions, themifyCodeEditor } from "@/utils/codeEditor";


/**
 * Reference: https://liveblocks.io/examples/collaborative-code-editor/nextjs-yjs-monaco
 */
export const CodeEditor = () => {
  const { handleEditorMount, provider } = useRoom()
  const { language, changeLanguage, supportedLanguages } = useDocument()
  const { colorMode } = useColorMode()

  return (
    <Stack>
      <Box w="fit-content" minW="300px">
        <Select value={language} options={supportedLanguages} onChange={(newValue) => changeLanguage(newValue as { label: string, value: string })} />
      </Box>
      {provider ? < Cursor yProvider={provider} /> : null}
      <Editor
        height="60vh"
        defaultValue={'// your code here'}
        onMount={handleEditorMount}
        language={language.value}
        options={codeEditorOptions}
        theme={themifyCodeEditor(colorMode)}
      />
    </Stack>
  )
}