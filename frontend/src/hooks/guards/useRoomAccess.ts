import { useEffect } from "react";
import useCheckAuth from "./useCheckAuth";
import { PATH_MAIN } from "@/routes/paths";
import useGetIdentity from "../auth/useGetIdentity";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import { BE_API } from "@/utils/api";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

const useRoomAccess = (roomId: string) => {
  const { identity } = useGetIdentity();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    authorizedAxios.get(`${BE_API.collaboration.room}/${roomId}/acceess`, {
      data: {
        userId: identity.id
      },
    }).then(res => {
      console.log('user has access rights')
    }).catch(err => {
      console.log("user does not have access to room");
      toast({
        title: "Insufficient permissions",
          description: "You do not have the necessary permissions to view this page.",
          status: "error",
          duration: 5000,
          isClosable: true,
      })
      router.push("/dashboard");
      
    })
  }, [roomId]);

  // This hook doesn't return anything, as it's only responsible for side effects
};

export default useRoomAccess;
