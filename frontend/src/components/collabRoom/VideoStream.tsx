// components/VideoStream.tsx
import React, { useRef, useEffect, useState } from "react";
import { Flex, Box, IconButton, useColorModeValue, useToast } from "@chakra-ui/react";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";

interface VideoStreamProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
}

const VideoStream: React.FC<VideoStreamProps> = ({
  localStream,
  remoteStream,
  onToggleCamera,
  onToggleMicrophone,
  isCameraOn,
  isMicrophoneOn,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const bgColor = useColorModeValue("whiteAlpha.600", "blackAlpha.600");

  // Set up local video stream
  useEffect(() => {
    if (localVideoRef.current) {
      console.log("karwi: localStream:", localStream);
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video stream
  useEffect(() => {
    if (remoteVideoRef.current) {
      console.log("karwi: remoteStream:", remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <Flex direction="row" align="center">
      {/* Local Video element */}
      <Box position="relative" width="160px" height="120px" bg="black" ml={4} borderRadius="lg">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
        />
        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          justify="space-around"
          bg={bgColor}
          p={0.5}
          borderRadius="lg"
          overflow="hidden"
        >
          <IconButton
            aria-label="Toggle camera"
            icon={isCameraOn ? <MdVideocam /> : <MdVideocamOff />}
            onClick={onToggleCamera}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Toggle microphone"
            icon={isMicrophoneOn ? <MdMic /> : <MdMicOff />}
            onClick={onToggleMicrophone}
            size="sm"
            variant="ghost"
          />
        </Flex>
      </Box>

      {/* Remote Video element */}
      <Box position="relative" width="160px" height="120px" bg="black" ml={4} borderRadius="lg">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    </Flex>
  );
};

export default VideoStream;
