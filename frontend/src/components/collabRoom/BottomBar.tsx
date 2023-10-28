// components/BottomBar.tsx
import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const BottomBar = () => {
  const { state, onCloseRoom } = useCollabContext();
  const { listOfActiveUsers } = state;

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
      <Button
        onClick={() => {
          alert("[BottomBar] Closing room...");
          onCloseRoom();
        }}
      >
        Close Room
      </Button>
    </Flex>
  );
};

export default BottomBar;
