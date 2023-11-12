// BottomBar.tsx
import React from "react";
import { Flex, Text, Box, useColorModeValue } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import VideoStream from "./VideoStream";
import { useVideoContext } from "@/contexts/VideoContext";

interface IUser {
  id: string;
  name: string | null;
}

const BottomBar: React.FC = () => {
  const { listOfActiveUsers } = useCollabContext();
  const { localStream, remoteStream, toggleCamera, toggleMicrophone, isCameraOn, isMicrophoneOn } =
    useVideoContext();

  return (
    <Flex align="center" justify="space-between" p={4}>
      <Flex>
        {listOfActiveUsers.map((user: IUser) => (
          <Flex align="center" key={user?.id} mr={4}>
            <Box borderRadius="full" width="10px" height="10px" bg="green.500" mr={2} />
            <Text>{user?.name || "Anonymous"}</Text>
          </Flex>
        ))}
      </Flex>

      {/* Use VideoStream component */}
      <VideoStream
        localStream={localStream}
        remoteStream={remoteStream}
        onToggleCamera={toggleCamera}
        onToggleMicrophone={toggleMicrophone}
        isCameraOn={isCameraOn}
        isMicrophoneOn={isMicrophoneOn}
      />
    </Flex>
  );
};

export default BottomBar;
