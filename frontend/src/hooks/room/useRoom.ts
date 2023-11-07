import { useEffect, useState } from "react";
import { RoomService } from "@/services/room";

export const useRoom = ({ roomName }: { roomName: string }) => {
  const [editor, setEditor] = useState<any>(null);
  const [roomService, setRoomService] = useState<RoomService | null>(null);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (roomService !== null) {
      // keep one client connection per user
      // TODO: keep in global state management
      return;
    }

    // once editor is mounted, initialise the room service to bind editor to websocket broadcast
    const room = new RoomService(roomName, editor);
    setRoomService(room);
  }, [editor]);

  const handleEditorMount = (editor: any) => {
    setEditor(editor);
  };

  return {
    handleEditorMount,
    provider: roomService && roomService.provider ? roomService.provider : null,
    document: roomService && roomService.document ? roomService.document : null,
    binding: roomService && roomService.binding ? roomService.binding : null,
  };
};
