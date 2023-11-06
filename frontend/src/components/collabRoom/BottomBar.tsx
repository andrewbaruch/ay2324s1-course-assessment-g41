import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useToast,
  Center,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
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

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { colorMode } = useColorMode();

  // You can also use `useColorModeValue` hook to switch values based on the color mode
  const bgColor = useColorModeValue("whiteAlpha.600", "blackAlpha.600");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);

  // Logic to connect and consume the remote stream
  useEffect(() => {
    // This function should be responsible for connecting to the remote stream
    const consumeRemoteStream = async () => {
      try {
        // Example: Connect to a WebSocket or signaling server to receive a remote stream
        // This is a placeholder: your implementation details will vary
        const remoteStream = await connectToRemoteStream("YOUR_STREAMING_ENDPOINT");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      } catch (error) {
        // Handle errors such as failed connections or stream errors
        toast({
          title: "Error accessing remote stream",
          description: (error as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    consumeRemoteStream();
  }, [toast]); // Make sure to include any dependencies your connection logic may need

  useEffect(() => {
    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);

        // Set the states to true only after getting the stream
        setIsCameraOn(mediaStream.getVideoTracks()[0]?.enabled ?? false);
        setIsMicrophoneOn(mediaStream.getAudioTracks()[0]?.enabled ?? false);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        // Handle the error by setting states to false
        setIsCameraOn(false);
        setIsMicrophoneOn(false);
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
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled); // Toggle and set the new state
      }
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicrophoneOn(audioTrack.enabled); // Toggle and set the new state
      }
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

      {/* Video elements container */}
      <Flex direction="row" align="center">
        {/* Local Video element with internal bottom bar */}
        {/* Video element with internal bottom bar */}
        <Center
          // position="relative" width="160px" height="120px"
          position="relative"
          width="160px"
          height="120px"
          bg="black"
          ml={4}
          borderRadius="lg"
        >
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
            bg={bgColor} // Using the hook to set the background based on the theme
            p={0.5}
            margin="0 auto"
            borderRadius="lg"
            overflow="hidden"
          >
            <IconButton
              aria-label="Toggle Microphone"
              icon={isMicrophoneOn ? <MdMic /> : <MdMicOff />}
              onClick={toggleMicrophone}
              colorScheme="white"
              variant="ghost"
              size="sm"
              isDisabled={!stream || stream.getAudioTracks().length === 0}
            />

            <IconButton
              aria-label="Toggle Camera"
              icon={isCameraOn ? <MdVideocam /> : <MdVideocamOff />}
              onClick={toggleCamera}
              colorScheme="white"
              variant="ghost"
              size="sm"
              isDisabled={!stream || stream.getVideoTracks().length === 0}
            />
          </Flex>
        </Center>
        {/* Remote Video element */}
        <Center
          position="relative"
          width="160px"
          height="120px"
          bg="black"
          ml={4}
          borderRadius="lg"
        >
          <Box
            as="video"
            ref={remoteVideoRef}
            autoPlay
            playsInline
            borderRadius="lg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "black", // Ensures background is black
            }}
            poster="path_to_black_screen_image_or_base64_encoded_black_image" // Placeholder for a black screen before the stream
          />
          {/* ... Optional bottom bar or other UI elements for remote video ... */}
        </Center>
      </Flex>
    </Flex>
  );
};
export default BottomBar;

// ... Here you will need to implement the actual connection function, for example:
async function connectToRemoteStream(endpoint: any) {
  // Your logic to receive the remote video stream
  // This could involve WebRTC, WebSocket, or other real-time streaming protocol
  return null;
}
