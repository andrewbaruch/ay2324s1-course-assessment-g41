import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import Peer, { SignalData } from "simple-peer";
import io from "socket.io-client";
import { HOST_API } from "@/config";
import { BE_API } from "@/utils/api";
import { useToast } from "@chakra-ui/react";

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
  roomId: string;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ children, roomId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const peerConnectionRef = useRef<Peer.Instance | null>(null);
  const socket = useRef(io(`${HOST_API}${BE_API.video.root}`, { query: { roomId } })).current;

  const toast = useToast();

  const startLocalStream = useCallback(async () => {
    try {
      console.log("Starting local stream");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: isMicrophoneOn,
      });
      setLocalStream(stream);
      toast({
        title: "Local stream started",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error accessing media devices.", error);
      toast({
        title: "Failed to start local stream",
        description: String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isCameraOn, isMicrophoneOn, toast]);

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

  const createAndSetupPeer = useCallback(
    (initiator: boolean, signal?: any) => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream ?? undefined,
      });

      peer.on("stream", setRemoteStream);

      if (signal) {
        peer.signal(signal);
      }

      return peer;
    },
    [localStream],
  );

  const callPeer = useCallback(() => {
    console.log(`Calling peer ${roomId}`);
    const peer = createAndSetupPeer(true);

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: roomId, signalData: data });
    });

    peerConnectionRef.current = peer;
  }, [createAndSetupPeer, socket, roomId]);

  const answerCall = useCallback(
    (signal: SignalData) => {
      console.log("Answering call");
      const peer = createAndSetupPeer(false, signal);

      peer.on("signal", (data) => {
        socket.emit("answerCall", { roomId, signal: data });
      });

      peerConnectionRef.current = peer;
    },
    [createAndSetupPeer, socket, roomId],
  );

  const leaveCall = useCallback(() => {
    console.log("Leaving call");
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
      peerConnectionRef.current = null;
      setRemoteStream(null);
    }
  }, []);

  useEffect(() => {
    socket.on("callUser", (data) => {
      if (!peerConnectionRef.current) {
        answerCall(data.signal);
      }
    });

    socket.on("callAccepted", (signal) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.signal(signal);
      }
    });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, [answerCall, socket]);

  useEffect(() => {
    if (roomId) {
      callPeer();
    }

    return () => {
      leaveCall();
    };
  }, [roomId, callPeer, leaveCall]);

  useEffect(() => {
    if (localStream && peerConnectionRef.current) {
      leaveCall();
      callPeer();
    }
  }, [localStream, callPeer, leaveCall]);

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
