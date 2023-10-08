import { useRef } from "react"
import { editor } from 'monaco-editor'
import * as Y from "yjs"
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { Editor } from "@monaco-editor/react";
import { SocketIOProvider } from "y-socket.io";

const serverWsUrl = "ws://localhost:1234"

export const CodeEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor

    // Initialise yjs
    const doc = new Y.Doc()

    // Connect to peers with WebSocket
    const provider: WebsocketProvider = new WebsocketProvider(serverWsUrl, "test", doc)
    const type = doc.getText('monaco')

    // Bind yjs doc to monaco editor
    const model = editor.getModel()
    if (model) {
      const binding = new MonacoBinding(type, model, new Set([editorRef.current]), provider.awareness)
      provider.connect()
      console.log(provider)
    }
  }

  return (
    <Editor
      height="60vh"
      defaultValue={'// your code here'}
      onMount={handleEditorMount}
    />
  )
}