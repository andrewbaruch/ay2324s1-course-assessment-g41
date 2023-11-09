// context/VideoContextProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";

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
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const prevCameraOnRef = useRef(isCameraOn);
  const prevMicrophoneOnRef = useRef(isMicrophoneOn);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: isMicrophoneOn,
      });
      console.log("karwi: setlocalstream");
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, [isCameraOn, isMicrophoneOn]);

  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null); // This ensures the reference is cleared and React re-renders if needed
    }
  }, [localStream]);

  const toggleCamera = useCallback(async () => {
    setIsCameraOn((prev) => !prev);
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      } else {
        // No video track, need to get one
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        newStream.getVideoTracks().forEach((track) => localStream.addTrack(track));
      }
    }
  }, [localStream]);

  const toggleMicrophone = useCallback(async () => {
    setIsMicrophoneOn((prev) => !prev);
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      } else {
        // No audio track, need to get one
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        newStream.getAudioTracks().forEach((track) => localStream.addTrack(track));
      }
    }
  }, [localStream]);

  useEffect(() => {
    // Check if the values have changed
    if (prevCameraOnRef.current === isCameraOn && prevMicrophoneOnRef.current === isMicrophoneOn) {
      // If there's no change, do nothing
      return;
    }

    // Update the refs with the new values
    prevCameraOnRef.current = isCameraOn;
    prevMicrophoneOnRef.current = isMicrophoneOn;

    // If the camera or microphone needs to be started or stopped, do so
    if (isCameraOn || isMicrophoneOn) {
      startLocalStream();
    } else {
      stopLocalStream();
    }

    // Cleanup function for unmounting
    return () => {
      stopLocalStream();
    };
  }, [isCameraOn, isMicrophoneOn, startLocalStream, stopLocalStream]);

  const connectToRemoteStream = useCallback(async () => {
    // Logic to connect to a remote stream
    // This is often done using WebRTC or other streaming technologies
    // For example, you might set up a peer connection and then set the remote stream
    // once you receive it on that connection
    // const remoteStream = await someFunctionToGetRemoteStream();
    // setRemoteStream(remoteStream);
  }, []);

  // The rest of your context provider remains the same
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
