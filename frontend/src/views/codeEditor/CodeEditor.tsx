import { editor } from 'monaco-editor'
import { Editor } from "@monaco-editor/react";
import { Cursor } from "../../components/editor";
import { useRoom } from "@/hooks/room/useRoom";


// TODO: @didy refactor
const options: editor.IStandaloneEditorConstructionOptions = {
  autoIndent: 'full',
  contextmenu: true,
  fontFamily: 'monospace',
  fontSize: 13,
  lineHeight: 24,
  hideCursorInOverviewRuler: true,
  matchBrackets: 'always',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 4,
  },
  selectOnLineNumbers: false,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: true,
};

/**
 * Reference: https://liveblocks.io/examples/collaborative-code-editor/nextjs-yjs-monaco
 */
export const CodeEditor = () => {
  const { handleEditorMount, provider } = useRoom()

  return (
    <>
      {provider ? < Cursor yProvider={provider} /> : null}
      <Editor
        height="60vh"
        defaultValue={'// your code here'}
        onMount={handleEditorMount}
        language={'python'}
        options={options}
      />
    </>
  )
}