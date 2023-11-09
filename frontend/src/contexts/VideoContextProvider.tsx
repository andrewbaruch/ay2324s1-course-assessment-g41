// context/VideoContextProvider.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// karwi: move provider elsewhere
interface VideoContextValue {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startLocalStream: () => Promise<void>;
  stopLocalStream: () => void;
  connectToRemoteStream: () => Promise<void>;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
}

export const VideoContext = createContext<VideoContextValue | undefined>(undefined);

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoContextProvider");
  }
  return context;
};

interface VideoContextProviderProps {
  children: ReactNode;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  // Your existing logic to manage the streams would go here
  // For the sake of this example, we'll just have stubs

  const startLocalStream = useCallback(async () => {
    // Logic to start the local stream
  }, []);

  const stopLocalStream = useCallback(() => {
    // Logic to stop the local stream
  }, []);

  const connectToRemoteStream = useCallback(async () => {
    // Logic to connect to the remote stream
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOn((prev) => !prev);
    // Further logic to actually enable/disable camera
  }, []);

  const toggleMicrophone = useCallback(() => {
    setIsMicrophoneOn((prev) => !prev);
    // Further logic to actually enable/disable microphone
  }, []);

  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
        startLocalStream,
        stopLocalStream,
        connectToRemoteStream,
        isCameraOn,
        isMicrophoneOn,
        toggleCamera,
        toggleMicrophone,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
