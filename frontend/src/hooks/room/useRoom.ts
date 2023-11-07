import { useEffect, useState } from "react";
import { RoomService } from "@/services/room";

export const useRoom = ({ roomName }: { roomName: string }) => {
  const [editor, setEditor] = useState<any>(null);
  const [roomService, setRoomService] = useState<RoomService | null>(null);

  useEffect(() => {
    if (!editor) {
      return;
    }

    // once editor is mounted, initialise the room service to bind editor to websocket broadcast
    const room = new RoomService(roomName, editor);
    setRoomService(room);

    return () => {
      roomService?.provider?.disconnect();
    }
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
