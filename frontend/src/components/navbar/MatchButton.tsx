import React, { useState, useRef, FC } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Progress,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { QuestionComplexity } from "@/@types/models/question"; // Assuming this is imported correctly
import { useMatching } from "@/hooks/matching/useMatchingRequest";
import { Status } from "@/@types/status";
import { openRoom } from "@/services/room";
import { useMatchingContext } from "@/contexts/MatchingContext";
import { useForm, Control } from "react-hook-form";
import ControlledSelect from "../form/ControlledSelect";
import { OptionBase } from "chakra-react-select";
import { useRouter } from "next/navigation";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

type ButtonProps = React.ComponentProps<typeof Button>;

const MatchButton: FC<ButtonProps> = (buttonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(100);
  const { control, watch } = useForm();
  const selectedComplexity = watch("complexity"); // Watch the complexity selection
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { sendMatchingRequest, getMatchingStatus } = useMatching();
  const { setComplexity } = useMatchingContext();
  const requestExpiryTimeInSeconds = 30;

  // Complexity options created from QuestionComplexity enum/object
  const complexityOptions: OptionType[] = Object.values(QuestionComplexity).map((complexity) => ({
    value: complexity,
    label: complexity,
  }));

  const startMatching = () => {
    if (!selectedComplexity) {
      toast({
        status: "error",
        description: "Please select a complexity level.",
        isClosable: true,
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    setIsLoading(true);
    setProgressValue(100);
    onClose();

    sendMatchingRequest(selectedComplexity).then(async () => {
      let intervalId = setInterval(() => {
        setProgressValue((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(intervalId);
            setIsLoading(false);
            return 0;
          }
          return prevProgress - (1 / requestExpiryTimeInSeconds) * 100;
        });

        getMatchingStatus()
          .then((response) => {
            handleMatchingResponse(response, intervalId);
          })
          .catch(() => {
            clearInterval(intervalId);
            setIsLoading(false);
            toast({
              status: "error",
              description: "Error occurred during matching. Please try again later.",
              isClosable: true,
              duration: 3000,
              position: "bottom",
            });
          });
      }, 1000);
    });
  };

  const handleMatchingResponse = (response: any, intervalId: NodeJS.Timeout) => {
    if (response.status === Status.paired) {
      clearInterval(intervalId);
      onRoomPaired(response);
    } else if (response.status === Status.expired) {
      clearInterval(intervalId);
      setIsLoading(false);
    }
  };

  const onRoomPaired = (response: any) => {
    if (response.roomId) {
      openRoom(response.roomId).then(() => {
        // Using selectedComplexity from the state instead of the old prop
        setComplexity(selectedComplexity);
        router.push(`/collab-room/${response.roomId}`);
      });
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        isDisabled={isLoading}
        {...buttonProps} // Spread the button props here
      >
        {isLoading ? `Matching... (${progressValue}%)` : "Find Match"}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Select Complexity
            </AlertDialogHeader>

            <AlertDialogBody>
              <ControlledSelect
                control={control}
                name="complexity"
                id="complexity"
                label="Complexity Level"
                options={complexityOptions}
                placeholder="Select complexity"
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={startMatching} colorScheme="blue">
                Start Matching
              </Button>
              <Button ref={cancelRef} onClick={onClose} ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MatchButton;
