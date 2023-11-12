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
  const callPeerConnectionRef = useRef<Peer.Instance | null>(null);
  const answerPeerConnectionRef = useRef<Peer.Instance | null>(null);
  const prevLocalStreamRef = useRef<MediaStream | null>(null);
  const socket = useRef(
    io(HOST_API, {
      // karwi: extract constant
      path: "/videostreaming/socket.io",
      query: { roomId },
    }),
  ).current;

  const toast = useToast();

  const startLocalStream = useCallback(
    async (isVideoOn: boolean, isAudioOn: boolean) => {
      console.log("VideoContext: startLocalStream");
      try {
        console.log("VideoContext: Starting local stream");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn,
        });
        console.log("VideoContext: stream:", stream);
        setLocalStream(stream);
        toast({
          title: "Local stream started",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("VideoContext: Error accessing media devices.", error);
        toast({
          title: "Failed to start local stream",
          description: String(error),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast],
  );

  const stopLocalStream = useCallback(() => {
    console.log("VideoContext: stopLocalStream");
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      console.log("VideoContext: emit streamStopped");
      socket.emit("streamStopped", { roomId });
    }
  }, [localStream, socket, roomId]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    } else {
      startLocalStream(true, false); // Start the stream if not already started
    }
    setIsCameraOn((prev) => !prev);
  }, [localStream, startLocalStream]);

  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    } else {
      startLocalStream(false, true); // Start the stream if not already started
    }
    setIsMicrophoneOn((prev) => !prev);
  }, [localStream, startLocalStream]);

  useEffect(() => {
    return () => {
      stopLocalStream(); // Stop the stream when the component unmounts
    };
  }, [stopLocalStream]);

  const createAndSetupPeer = useCallback(
    (initiator: boolean, signal?: SignalData) => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream ?? undefined,
      });

      peer.on("error", (err) => {
        console.error("VideoContext: Peer connection error:", err);
        toast({
          title: "Peer Connection Error",
          description: String(err),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

      peer.on("connect", () => {
        console.log("VideoContext: Peer connection established");
      });

      peer.on("close", () => {
        console.log("VideoContext: Peer connection closed");
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

    callPeerConnectionRef.current = peer;
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

      answerPeerConnectionRef.current = peer;
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
    // Close call peer connection
    if (callPeerConnectionRef.current) {
      callPeerConnectionRef.current.destroy();
      callPeerConnectionRef.current = null;
    }
    // Close answer peer connection
    if (answerPeerConnectionRef.current) {
      answerPeerConnectionRef.current.destroy();
      answerPeerConnectionRef.current = null;
    }

    // if (peerConnectionRef.current) {
    //   peerConnectionRef.current.destroy();
    //   peerConnectionRef.current = null;
    //   toast({
    //     title: "Left Call",
    //     description: "You have left the call.",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // }
  }, []);

  useEffect(() => {
    console.log("VideoContext: Setting up socket event listeners");

    socket.on("error", (error) => {
      console.error("VideoContext: Socket error: ", error);
      toast({
        title: "Socket Error",
        description: "An error occurred with the socket connection.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.on("callUser", (data) => {
      console.log("VideoContext: Received call from peer");

      // karwi: used to handle user might reinit
      answerCall(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      console.log("VideoContext: Call accepted by peer");
      if (callPeerConnectionRef.current) {
        console.log("VideoContext: Signaling call acceptance");
        callPeerConnectionRef.current.signal(signal);
      }
    });

    socket.on("streamStopped", () => {
      console.log("VideoContext: Remote peer's stream stopped.");
      setRemoteStream(null);
    });

    socket.on("roomFull", (roomId) => {
      console.log(`VideoContext: Cannot join room ${roomId}, it is already full.`);
      // Display an appropriate message to the user
    });

    socket.on("peerDisconnected", ({ peerId }) => {
      console.log(`VideoContext: Peer disconnected: ${peerId}`);
      // Handle the disconnection logic here
      // For example, you might want to set the remoteStream to null
      if (peerId !== socket.id) {
        setRemoteStream(null);
      }
    });

    return () => {
      console.log("VideoContext: Cleaning up socket event listeners");
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("error");
      socket.off("streamStopped");
      socket.off("roomFull");
      socket.off("peerDisconnected");
    };
  }, [answerCall, socket, toast]);

  useEffect(() => {
    console.log("VideoContext: Checking for call initiation or reinitiation.");

    // Initiate or reinitiate call if room ID is set and either:
    // - There's no existing peer connection
    // - The local stream has been updated
    if (roomId && (!callPeerConnectionRef.current || prevLocalStreamRef.current !== localStream)) {
      console.log(`VideoContext: Initiating call with room ID ${roomId}.`);
      callPeer();
    }

    // Store the current local stream for comparison in the next effect run
    prevLocalStreamRef.current = localStream;

    return () => {
      console.log(
        "VideoContext: Leaving call due to component unmount, room ID change, or local stream update.",
      );
      leaveCall();
    };
  }, [roomId, localStream, callPeer, leaveCall]);

  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
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
