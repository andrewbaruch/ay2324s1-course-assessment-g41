import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { BE_API } from "@/utils/api";

export class RoomService {
  readonly document: Y.Doc | undefined;
  readonly provider: HocuspocusProvider | undefined;
  readonly binding: MonacoBinding | undefined;

  constructor(roomName: string, editor: monaco.editor.IStandaloneCodeEditor) {
    const { document, provider } = this.initWsConnection(roomName);
    this.document = document;
    this.provider = provider;
    const { binding } = this.bindDocumentToMonacoEditor(editor);
    this.binding = binding;
  }

  private initWsConnection(roomName: string) {
    // Initialise yjs
    let yDoc: Y.Doc = new Y.Doc();

    // Connect to peers with WebSocket
    let yProvider: HocuspocusProvider = new HocuspocusProvider({
      url: `${process.env.NEXT_PUBLIC_HOST_API_KEY?.replace("http://", "ws://")}/${
        BE_API.collaboration.broadcast
      }`,
      name: roomName, // room name
      document: yDoc,
    });

    return { document: yDoc, provider: yProvider };
  }

  private bindDocumentToMonacoEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    if (!this.document || !this.provider || typeof window === "undefined") {
      // throw error
      return { binding: undefined };
    }

    const text = this.document.getText("monaco");
    const model = editor.getModel() as monaco.editor.ITextModel;
    const binding =
      typeof window === "undefined"
        ? undefined
        : new MonacoBinding(
            text,
            model,
            new Set([editor as monaco.editor.IStandaloneCodeEditor]),
            this.provider.awareness,
          );
    return { binding };
  }
}