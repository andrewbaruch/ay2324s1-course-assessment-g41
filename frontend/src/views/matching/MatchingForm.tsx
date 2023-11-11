import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Button,
  FormErrorMessage,
  useToast,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spacer,
} from "@chakra-ui/react";

import { useState } from "react";
import React from "react";
import { QuestionComplexity } from "@/@types/models/question";
import { useForm } from "react-hook-form";
import { useMatching } from "@/hooks/matching/useMatchingRequest";

import { useRouter } from "next/navigation";
import { Status } from "@/@types/status";
import { openRoom } from "@/services/room";
import { useMatchingContext } from "@/contexts/MatchingContext";

export const MatchingForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { sendMatchingRequest, getMatchingStatus } = useMatching();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setComplexity } = useMatchingContext()

  return (
    <Stack
      px={6}
      py={8}
      bgColor="white"
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={1}
      overflowY="auto"
      height="100%"
      display="flex"
    >
      <Heading fontWeight="bold">Peer Coding</Heading>

      <Text color="gray.500">
        Match with a peer to tackle problems together! Feel free to choose the complexity of the
        question and we will pair you up with someone similar.
      </Text>

      <Stack spacing={2} display="flex" px={0}>
        <FormControl>
          <FormLabel htmlFor="userId">User Id</FormLabel>
          <Input placeholder="User Id" defaultValue="1" {...register("userId")} />
        </FormControl>
        <FormControl isInvalid={errors.complexity ? true : false}>
          <FormLabel htmlFor="complexity">Complexity</FormLabel>
          <Select
            id="complexity"
            placeholder={"Select an option"}
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            focusBorderColor="gray.500"
            {...register("complexity", {
              required: "Complexity of the question is required.",
            })}
          >
            {Object.values(QuestionComplexity).map((complexity) => (
              <option>{complexity}</option>
            ))}
          </Select>
          {errors.complexity ? (
            <FormErrorMessage>{errors.complexity.message}</FormErrorMessage>
          ) : null}
        </FormControl>
      </Stack>

      <Button
        type="submit"
        onClick={handleSubmit((data) => {
          try {
            onOpen();
            setIsLoading(true);

            sendMatchingRequest(data.userId, data.complexity).then(async () => {
              await new Promise((r) => setTimeout(r, 1000));
              let intervalId: NodeJS.Timeout | null = setInterval(() => {
                getMatchingStatus(data.userId)
                  .then((response) => {
                    console.log(response);
                    const responseStatus = response.status;
                    console.log("in frontend, status code", response);
                    if (intervalId && responseStatus == Status.paired) {
                      clearInterval(intervalId);
                      intervalId = null;
                      if (response.roomId) {
                        openRoom(response.roomId).then(res => {
                          // save complexity
                          // const keyIndex = Object.keys(QuestionComplexity)[enumIndex]
                          // console.log(enumIndex, QuestionComplexity[keyIndex])
                          setComplexity(data.complexity);
                          router.push(`/collab-room/${response.roomId}`);
                        }).catch(err => {
                          toast({
                            description: err?.message || "Unknown error occured. Please try again later.",
                            status: "error",
                            isClosable: true,
                            duration: 3000,
                            position: "bottom",
                          })
                          router.push('/dashboard');
                        });
                      }
                      return;
                    }
                    if (intervalId && responseStatus == Status.expired) {
                      clearInterval(intervalId);
                      intervalId = null;
                      setIsLoading(false);
                      return;
                    }
                  })
                  .catch((e: Error) => {
                    throw new Error("Polling cancelled due to API error");
                  });
              }, 1000);
            });
          } catch (err) {
            toast({
              status: "error",
              description: err?.message || "Unknown error encountered. Please try again later.",
              isClosable: true,
              duration: 3000,
              position: "bottom",
            });
          }
        })}
        w="fit-content"
        py={2}
        size="sm"
      >
        Match
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Matching
            </AlertDialogHeader>

            {isLoading ? (
              <AlertDialogBody>
                <Spinner />
              </AlertDialogBody>
            ) : (
                <>
                  <AlertDialogBody>
                    There seems to be no other peers :(
                  <Spacer />
                  Do try again in a few minutes!
                </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                  </Button>
                    {/* <Button onClick={onClose} ml={3}>
                    Try again
                  </Button> */}
                  </AlertDialogFooter>
                </>
              )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Stack>
  );
};