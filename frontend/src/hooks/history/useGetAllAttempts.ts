import { Attempt } from "@/@types/attempt";
import { useEffect, useState } from "react"
import * as HistoryService from "../../services/history"

export const useGetAllAttempts = ({ roomName, dependencies }: { roomName: string, dependencies: any[] }) => {
  
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const getAttempts = async () => {
      const allAttempts = await HistoryService.getAllAttemptsInRoom(roomName)
      setAttempts(allAttempts);
    }
    getAttempts();
  }, [roomName, ...dependencies]);

  return {
    attempts
  }
}