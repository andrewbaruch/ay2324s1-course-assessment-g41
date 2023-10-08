import { useEffect, useState } from "react"
import { editor } from 'monaco-editor'
import * as Y from "yjs"
import { MonacoBinding } from 'y-monaco';
import { Editor } from "@monaco-editor/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Cursor } from "../../components/editor";

// TODO: @didy move to environment
const serverWsUrl = "ws://localhost:1234"

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
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>()
  const [provider, setProvider] = useState<HocuspocusProvider>();

  useEffect(() => {
    if (!editorRef) {
      return
    }

    let yProvider: HocuspocusProvider;
    let yDoc: Y.Doc;
    let binding: MonacoBinding;

    // Initialise yjs
    yDoc = new Y.Doc()

    // Connect to peers with WebSocket
    yProvider = new HocuspocusProvider({
      url: serverWsUrl,
      name: "test", // room name
      document: yDoc,
    })
    setProvider(yProvider)

    // Bind yjs doc to monaco editor
    const yText = yDoc.getText('monaco')
    const model = editorRef.getModel()
    binding = new MonacoBinding(yText, model as editor.ITextModel, new Set([editorRef]), yProvider.awareness)
  }, [editorRef])

  useEffect(() => {
    if (!provider) {
      return
    }

  }, [provider])

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    setEditorRef(editor)
  }

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