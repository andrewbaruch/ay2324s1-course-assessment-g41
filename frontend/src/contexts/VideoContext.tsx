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
  const prevCameraOnRef = useRef(isCameraOn);
  const prevMicrophoneOnRef = useRef(isMicrophoneOn);
  const socket = useRef(
    io(HOST_API, {
      path: "/videostreaming/socket.io",
      query: { roomId },
    }),
  ).current;

  const toast = useToast();

  const startLocalStream = useCallback(async () => {
    console.log("VideoContext: startLocalStream");
    try {
      console.log("VideoContext: Starting local stream");
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
    console.log("VideoContext: toggleCamera");
    setIsCameraOn((prev) => !prev);
  }, []);

  const toggleMicrophone = useCallback(() => {
    console.log("VideoContext: toggleMicrophone");
    setIsMicrophoneOn((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log("VideoContext: Camera or microphone state changed");

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

  const createAndSetupPeer = useCallback(
    (initiator: boolean, signal?: SignalData) => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream ?? undefined,
      });

      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        toast({
          title: "Peer Connection Error",
          description: String(err),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

      peer.on("connect", () => {
        console.log("Peer connection established");
      });

      peer.on("close", () => {
        console.log("Peer connection closed");
      });

      peer.on("stream", setRemoteStream);

      if (signal) {
        peer.signal(signal);
      }

      return peer;
    },
    [localStream, toast],
  );

  const callPeer = useCallback(() => {
    console.log(`VideoContext: Calling peer ${roomId}`);
    const peer = createAndSetupPeer(true);

    peer.on("signal", (data) => {
      socket.emit("callUser", { roomId: roomId, signalData: data });
    });

    peerConnectionRef.current = peer;
    toast({
      title: "Call Initiated",
      description: `Calling room ${roomId}`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  }, [createAndSetupPeer, socket, roomId, toast]);

  const answerCall = useCallback(
    (signal: SignalData) => {
      console.log("VideoContext: Answering call");
      const peer = createAndSetupPeer(false, signal);

      peer.on("signal", (data) => {
        socket.emit("answerCall", { roomId, signal: data });
      });

      peerConnectionRef.current = peer;
      toast({
        title: "Call Answered",
        description: `Joined room ${roomId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [createAndSetupPeer, socket, roomId, toast],
  );

  const leaveCall = useCallback(() => {
    console.log("VideoContext: Leaving call");
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
      peerConnectionRef.current = null;
      toast({
        title: "Left Call",
        description: "You have left the call.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    socket.on("error", (error) => {
      console.error("Socket error: ", error);
      toast({
        title: "Socket Error",
        description: "An error occurred with the socket connection.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });

    console.log("VideoContext: Setting up socket event listeners");

    socket.on("callUser", (data) => {
      console.log("VideoContext: Received call from peer");

      // karwi: used to handle user might reinit
      answerCall(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      console.log("VideoContext: Call accepted by peer");
      if (peerConnectionRef.current) {
        console.log("VideoContext: Signaling call acceptance");
        peerConnectionRef.current.signal(signal);
      }
    });

    return () => {
      console.log("VideoContext: Cleaning up socket event listeners");
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("error");
    };
  }, [answerCall, socket, toast]);

  useEffect(() => {
    console.log(`VideoContext: Room ID changed to ${roomId}. Initiating call if room ID is set.`);
    if (roomId && !peerConnectionRef.current) {
      callPeer();
    }

    return () => {
      console.log("VideoContext: Leaving call due to component unmount or room ID change.");
      leaveCall();
    };
    // karwi: fix deps
  }, [roomId]);

  useEffect(() => {
    // karwi: leave call when localstream is null?
    console.log("VideoContext: Local stream updated. Restarting call if in an existing call.");
    if (localStream && peerConnectionRef.current) {
      console.log("VideoContext: Leaving and reinitiating call due to local stream change.");
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
