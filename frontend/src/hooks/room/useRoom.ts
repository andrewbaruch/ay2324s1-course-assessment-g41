import { useEffect, useState } from "react";
import { editor as Editor } from "monaco-editor";
import { RoomService } from "@/services/room";

export const useRoom = () => {
  const [editor, setEditor] = useState<Editor.IStandaloneCodeEditor>();
  const [roomService, setRoomService] = useState<RoomService>();

  useEffect(() => {
    if (!editor) {
      return;
    }

    // once editor is mounted, initialise the room service to bind editor to websocket broadcast
    const room = new RoomService("test", editor);
    setRoomService(room);
  }, [editor]);

  const handleEditorMount = (editor: Editor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  return {
    handleEditorMount,
    provider: roomService?.provider,
    document: roomService?.document,
    binding: roomService?.binding,
  };
};
