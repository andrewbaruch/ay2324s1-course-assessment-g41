import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

// karwi: modify this
const socket = io("http://localhost:5000"); // Adjust the URL to your server

interface VideoContextValue {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startLocalStream: () => Promise<void>;
  stopLocalStream: () => void;
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
  roomId: string; // The peer ID or room ID to connect to
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ children, roomId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const peerConnectionRef = useRef<Peer.Instance | null>(null);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: isMicrophoneOn,
      });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, [isCameraOn, isMicrophoneOn]);

  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    setIsCameraOn((prev) => !prev);
  }, []);

  const toggleMicrophone = useCallback(() => {
    setIsMicrophoneOn((prev) => !prev);
  }, []);

  const callPeer = useCallback(
    (id: string) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream ?? undefined,
      });

      peer.on("signal", (data) => {
        socket.emit("callUser", { userToCall: id, signalData: data });
      });

      socket.on("callAccepted", (signal) => {
        peer.signal(signal);
      });

      peer.on("stream", (stream) => {
        setRemoteStream(stream);
      });

      peerConnectionRef.current = peer;
    },
    [localStream],
  );

  const answerCall = useCallback(() => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream ?? undefined,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", data);
    });

    socket.on("callerSignal", (signal) => {
      peer.signal(signal);
    });

    peer.on("stream", (stream) => {
      setRemoteStream(stream);
    });

    peerConnectionRef.current = peer;
  }, [localStream]);

  const leaveCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
      peerConnectionRef.current = null;
      setRemoteStream(null);
    }
  }, []);

  useEffect(() => {
    // Listen for incoming calls
    socket.on("incomingCall", (data) => {
      // Automatically answer the call
      answerCall();
    });

    // Automatically call the peer when the roomId changes
    if (roomId) {
      callPeer(roomId);
    }

    // Cleanup: Leave call and remove event listener when the component unmounts
    return () => {
      leaveCall();
      socket.off("incomingCall");
    };
  }, [roomId, callPeer, leaveCall, answerCall]);

  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
        startLocalStream,
        stopLocalStream,
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

export default VideoContextProvider;
