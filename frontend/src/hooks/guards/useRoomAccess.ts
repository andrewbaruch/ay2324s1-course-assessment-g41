import { useEffect, useState } from "react";
import useCheckAuth from "./useCheckAuth";
import { PATH_MAIN } from "@/routes/paths";
import useGetIdentity from "../auth/useGetIdentity";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import { BE_API } from "@/utils/api";
import { useToast } from "@chakra-ui/react";

const useRoomAccess = (roomId: string) => {
  const { identity } = useGetIdentity();
  const toast = useToast();
  const [hasRoomAccess, setHasRoomAccess] = useState(true);

  useEffect(() => {
    authorizedAxios
      .get(`${BE_API.collaboration.room}/${roomId}/acceess`, {
        data: {
          userId: identity.id,
        },
      })
      .then((res) => {
        console.log("user has access rights");
        setHasRoomAccess(true);
      })
      .catch((err) => {
        console.log("user does not have access to room");
        toast({
          title: "Insufficient permissions",
          description: "You do not have the necessary permissions to enter this room.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setHasRoomAccess(false);
      });
  }, [roomId]);

  // This hook doesn't return anything, as it's only responsible for side effects
  return {
    hasRoomAccess,
  };
};

export default useRoomAccess;
