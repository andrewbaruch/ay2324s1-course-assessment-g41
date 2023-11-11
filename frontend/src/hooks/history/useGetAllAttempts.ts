import { Attempt } from "@/@types/attempt";
import { useEffect, useState } from "react"
import * as HistoryService from "../../services/history"

export const useGetAllAttempts = ({ roomName }: { roomName: string }) => {
  
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    HistoryService.getAllAttemptsInRoom(roomName).then(res => {
      setAttempts(res);
    });
  }, [roomName]);

  return {
    attempts
  }
}