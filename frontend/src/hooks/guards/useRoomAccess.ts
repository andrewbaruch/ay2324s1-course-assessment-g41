import { useEffect } from "react";
import useCheckAuth from "./useCheckAuth";

const useRoomAccess = (roomId: string) => {
  const checkAuth = useCheckAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Pass roomId to checkAuth, which will be used to verify if the user has access to this specific room
        await checkAuth({}, roomId);
      } catch (error) {
        // Error has been handled by the guard
      }
    };

    verifyAccess();
  }, [checkAuth, roomId]);

  // This hook doesn't return anything, as it's only responsible for side effects
};

export default useRoomAccess;
