import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const BottomBar = () => {
  const { state, onCloseRoom } = useCollabContext();
  const { listOfActiveUsers } = state;

  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState(false);
  const onCloseCloseRoomModal = () => setIsCloseRoomModalOpen(false);
  const cancelRef = useRef(null);

  const handleCloseRoom = () => {
    console.log("[BottomBar] Closing room...");
    onCloseRoom();
    setIsCloseRoomModalOpen(false); // Close the confirmation modal
  };

  return (
    <Flex align="center" justify="space-between" p={4}>
      <Flex>
        {listOfActiveUsers.map((user) => (
          <Flex align="center" key={user.id} mr={4}>
            <Box borderRadius="full" width="10px" height="10px" bg="green.500" mr={2} />
            <Text>{user.name || "Anonymous"}</Text>
          </Flex>
        ))}
      </Flex>
      <Button colorScheme="red" onClick={() => setIsCloseRoomModalOpen(true)}>
        Close Room
      </Button>

      <AlertDialog
        isOpen={isCloseRoomModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseCloseRoomModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Room
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to close this room? All unsaved changes will be lost.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseCloseRoomModal}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleCloseRoom} ml={3}>
                Close Room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default BottomBar;
