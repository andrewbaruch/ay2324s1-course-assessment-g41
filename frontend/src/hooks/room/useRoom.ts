import { useEffect, useState } from "react";
import { DocumentService } from "@/services/room";

export const useRoom = ({ roomName }: { roomName: string }) => {
  const [editor, setEditor] = useState<any>(null);
  const [documentService, setDocumentService] = useState<DocumentService | null>(null);

  useEffect(() => {
    if (!editor) {
      return;
    }

    // once editor is mounted, initialise the room service to bind editor to websocket broadcast
    const room = new DocumentService(roomName, editor);
    setDocumentService(room);

    return () => {
      documentService?.provider?.disconnect();
    }
  }, [editor]);

  const handleEditorMount = (editor: any) => {
    setEditor(editor);
  };

  return {
    handleEditorMount,
    provider: documentService && documentService.provider ? documentService.provider : null,
    document: documentService && documentService.document ? documentService.document : null,
    binding: documentService && documentService.binding ? documentService.binding : null,
  };
};
