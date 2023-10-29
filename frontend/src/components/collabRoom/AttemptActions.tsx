import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  IconButton,
  Text,
  Flex,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const AttemptActions = () => {
  const { state, onNewAttempt, onDeleteAttempt, setCurrentAttempt, currentAttempt } =
    useCollabContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const onCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const cancelRef = React.useRef(null);

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      const selectedAttempt = state.listOfAttempts[pageIndex];
      if (selectedAttempt) {
        setCurrentAttempt(selectedAttempt);
        setCurrentPage(pageIndex);
      }
    },
    [state.listOfAttempts, setCurrentAttempt],
  );

  useEffect(() => {
    handlePageChange(0); // Set the first page as default display
  }, [handlePageChange]);

  const handleNewAttempt = () => {
    if (currentAttempt) {
      onNewAttempt(currentAttempt.question.id);
    }
  };

  const handleDeleteAttempt = (attemptId: number) => {
    onDeleteAttempt(attemptId);
    onCloseDeleteModal();
  };

  return (
    <Box mt={4}>
      <Flex align="center" justify="space-between" wrap="wrap">
        <Flex align="center" justify="center" wrap="wrap" mr={4}>
          <IconButton
            aria-label="Previous Page"
            icon={<ChevronLeftIcon />}
            isDisabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          <Text mx={2}>{currentPage + 1}</Text>
          <IconButton
            aria-label="Next Page"
            icon={<ChevronRightIcon />}
            isDisabled={currentPage === state.listOfAttempts.length - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Flex>
        {currentAttempt && (
          <>
            <IconButton
              aria-label="Delete Attempt"
              icon={<DeleteIcon />}
              onClick={() => setIsDeleteModalOpen(true)}
              colorScheme="red"
              variant="outline"
            />
            <AlertDialog
              isOpen={isDeleteModalOpen}
              leastDestructiveRef={cancelRef}
              onClose={onCloseDeleteModal}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Attempt
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                    Are you sure you want to delete this attempt? This action cannot be undone.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onCloseDeleteModal}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteAttempt(currentAttempt.attemptId)}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
        <Button colorScheme="blue" onClick={handleNewAttempt}>
          New Attempt
        </Button>
      </Flex>
    </Box>
  );
};

export default AttemptActions;
