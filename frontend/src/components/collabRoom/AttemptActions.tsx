// components/AttemptActions.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Button, Stack, IconButton, Text, Flex } from "@chakra-ui/react";
import { DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const AttemptActions = () => {
  const { state, onNewAttempt, onDeleteAttempt, setCurrentAttempt, currentAttempt } =
    useCollabContext();
  const [currentPage, setCurrentPage] = useState(0);

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
  };

  return (
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
        <IconButton
          aria-label="Delete Attempt"
          icon={<DeleteIcon />}
          onClick={() => handleDeleteAttempt(currentAttempt.attemptId)}
        />
      )}
      <Button onClick={handleNewAttempt}>New Attempt</Button>
    </Flex>
  );
};

export default AttemptActions;
