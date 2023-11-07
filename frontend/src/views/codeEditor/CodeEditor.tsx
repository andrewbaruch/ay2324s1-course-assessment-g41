"use client";

import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";

import { Cursor } from "../../components/editor";
import { Stack, useColorMode } from "@chakra-ui/react";
import { codeEditorOptions, themifyCodeEditor } from "@/utils/codeEditor";
import { useCollabContext } from "@/hooks/contexts/useCollabContext";

// karwi: integrate this
/**
 * Reference: https://liveblocks.io/examples/collaborative-code-editor/nextjs-yjs-monaco
 */
export const CodeEditor = () => {
  const { handleEditorMount, provider, currentAttempt } = useCollabContext();
  const language = currentAttempt?.language;
  const { colorMode } = useColorMode();

  useEffect(() => {
    return () => provider?.disconnect()
  }, []);

  return (
    <Stack>
      {provider ? <Cursor yProvider={provider} /> : null}
      <Editor
        height="60vh"
        onMount={handleEditorMount}
        language={language ? language.value : "plaintext"}
        options={codeEditorOptions}
        theme={themifyCodeEditor(colorMode)}
      />
    </Stack>
  );
};
