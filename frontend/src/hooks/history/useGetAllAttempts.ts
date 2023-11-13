import { Attempt } from "@/@types/attempt";
import { useEffect, useState } from "react";
import * as HistoryService from "../../services/history";

export const useGetAllAttempts = ({
  roomName,
  currentAttempt,
}: {
  roomName: string;
  currentAttempt: Attempt;
}) => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const getAttempts = async () => {
      const allAttempts = await HistoryService.getAllAttemptsInRoom(roomName);
      setAttempts(allAttempts);
    };
    getAttempts();
  }, [roomName, currentAttempt]);

  return {
    attempts,
  };
};
