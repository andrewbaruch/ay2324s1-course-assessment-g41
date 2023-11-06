import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, IconButton, useToast, Center } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";

// Adjusted IUser interface to match the User type from useCollabContext
interface IUser {
  id: string;
  name: string | null; // Allow for 'null' as well as 'string'
}

const BottomBar: React.FC = () => {
  const { listOfActiveUsers } = useCollabContext();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toast = useToast();

  // Moved startVideo inside useEffect to avoid eslint warning about dependencies
  useEffect(() => {
    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        toast({
          title: "Error accessing camera or microphone",
          description: (error as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    startVideo();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures this effect runs only once

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  };

  return (
    <Flex align="center" justify="space-between" p={4}>
      {/* User list */}
      <Flex>
        {listOfActiveUsers.map((user: IUser) => (
          <Flex align="center" key={user.id} mr={4}>
            <Box borderRadius="full" width="10px" height="10px" bg="green.500" mr={2} />
            <Text>{user.name || "Anonymous"}</Text>
          </Flex>
        ))}
      </Flex>

      {/* Video element with internal bottom bar */}
      <Center position="relative" width="160px" height="120px">
        <Box
          as="video"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          borderRadius="lg" // This adds a larger border-radius. You can use "md", "sm", "full" for different sizes.
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // This will ensure the video covers the area without stretching
            transform: "scaleX(-1)", // Mirrors the video
          }}
        />
        {/* Translucent Bottom Bar */}
        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          justify="space-around"
          bg="blackAlpha.600"
          p={0.5}
          margin="0 auto"
          borderRadius="lg" // Apply rounded corners to the bottom bar
          // Optionally, if you want only the bottom corners rounded, you can do:
          // borderRadius="0 0 lg lg"
          overflow="hidden" // Ensure the child elements don't bleed outside the rounded corners
        >
          {/* Microphone Toggle */}
          <IconButton
            aria-label="Toggle Microphone"
            icon={stream?.getAudioTracks()[0]?.enabled ? <MdMic /> : <MdMicOff />}
            onClick={toggleMicrophone}
            colorScheme="white"
            variant="ghost"
            size="sm"
            mr={2}
          />
          {/* Camera Toggle */}
          <IconButton
            aria-label="Toggle Camera"
            icon={stream?.getVideoTracks()[0]?.enabled ? <MdVideocam /> : <MdVideocamOff />}
            onClick={toggleCamera}
            colorScheme="white"
            variant="ghost"
            size="sm"
          />
        </Flex>
      </Center>
    </Flex>
  );
};

export default BottomBar;
