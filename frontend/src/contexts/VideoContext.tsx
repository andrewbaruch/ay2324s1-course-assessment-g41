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

  // karwi: check the deps
  // start stream and set local stream
  // when change then will change local stream
  const startLocalStream = useCallback(async () => {
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

  // will stop the current local stream
  // then will have nothing to stream
  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  // to set the state above
  const toggleCamera = useCallback(() => {
    setIsCameraOn((prev) => !prev);
  }, []);

  const toggleMicrophone = useCallback(() => {
    setIsMicrophoneOn((prev) => !prev);
  }, []);

  // create peer; listen to stream; add myself in first;
  // qn: where is myself; then emit?
  // im the initiator;
  // then will add this person to this grp
  const createAndSetupPeer = useCallback(
    (initiator: boolean, signal?: SignalData) => {
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

  // on adding self then i will emit this one
  // karwi: callPeer might be called twice
  const callPeer = useCallback(() => {
    console.log(`VideoContext: Calling peer ${roomId}`);
    const peer = createAndSetupPeer(true);

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: roomId, signalData: data });
    });

    peerConnectionRef.current = peer;
  }, [createAndSetupPeer, socket, roomId]);

  // you call me then i answer;
  // then i add myself in; then add you in; then emit answer call;
  // on call receive; then you add me in;
  const answerCall = useCallback(
    (signal: SignalData) => {
      console.log("VideoContext: Answering call");
      const peer = createAndSetupPeer(false, signal);

      peer.on("signal", (data) => {
        socket.emit("answerCall", { roomId, signal: data });
      });

      peerConnectionRef.current = peer;
    },
    [createAndSetupPeer, socket, roomId],
  );

  // cut off all;
  const leaveCall = useCallback(() => {
    console.log("VideoContext: Leaving call");
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
      peerConnectionRef.current = null;
      // setRemoteStream(null);
    }
  }, []);

  useEffect(() => {
    console.log("Setting up socket event listeners");

    socket.on("callUser", (data) => {
      console.log("Received call from peer");
      // if (!peerConnectionRef.current) {
      //   console.log("No existing peer connection. Answering call.");
      //   answerCall(data.signal);
      // } else {
      //   console.log("Already in a call. Ignoring incoming call.");
      // }
      // karwi: user might reinit
      answerCall(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      console.log("Call accepted by peer");
      if (peerConnectionRef.current) {
        console.log("Signaling call acceptance");
        peerConnectionRef.current.signal(signal);
      }
    });

    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, [answerCall, socket]);

  // start; then will call peer;
  // when all change; call peer change; then will call again;
  useEffect(() => {
    console.log(`Room ID changed to ${roomId}. Initiating call if room ID is set.`);
    if (roomId && !peerConnectionRef.current) {
      callPeer();
    }

    return () => {
      console.log("Leaving call due to component unmount or room ID change.");
      leaveCall();
    };
  }, [roomId, leaveCall, callPeer]);

  // if you change to this one;
  // qn: what does this do ?
  // if change local stream; then leave call;
  useEffect(() => {
    console.log("Local stream updated. Restarting call if in an existing call.");
    if (localStream && peerConnectionRef.current) {
      console.log("Leaving and reinitiating call due to local stream change.");
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
