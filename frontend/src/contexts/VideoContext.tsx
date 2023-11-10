// context/VideoContextProvider.tsx
import { SignalingClient } from "@/@types/video";
import { useToast } from "@chakra-ui/react";
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
  // karwi: clean up using the returned callback
  connectToRemoteStream: () => Promise<() => void>;
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
  signalingClient: SignalingClient;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({
  children,
  signalingClient,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const prevCameraOnRef = useRef(isCameraOn);
  const prevMicrophoneOnRef = useRef(isMicrophoneOn);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const toast = useToast();
  const [peers, setPeers] = useState(new Set<string>());

  const handleError = useCallback(
    (error: unknown, message: string) => {
      if (error instanceof Event) {
        console.error("karwi: streaming: Error event:", error);
      } else {
        console.error("karwi: streaming: Error object:", error);
      }

      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
    [toast],
  );

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

  // Handle new peer joining
  const handleNewPeer = useCallback((peerId: string) => {
    setPeers((prevPeers) => new Set([...prevPeers, peerId]));
    // Additional logic for a new peer (e.g., create RTCPeerConnection, UI update)
  }, []);

  // Handle peer disconnection
  const handlePeerDisconnected = useCallback((peerId: string) => {
    setPeers((prevPeers) => {
      const updatedPeers = new Set(prevPeers);
      updatedPeers.delete(peerId);
      return updatedPeers;
    });
    // Additional cleanup logic for the disconnected peer
  }, []);

  useEffect(() => {
    signalingClient.onNewPeer(handleNewPeer);
    signalingClient.onPeerDisconnected(handlePeerDisconnected);

    // ... other initialization code ...

    return () => {
      // Clean up on unmount or when dependencies change
      signalingClient.onNewPeer(() => {});
      signalingClient.onPeerDisconnected(() => {});
    };
  }, [handleNewPeer, handlePeerDisconnected, signalingClient]);

  useEffect(() => {
    console.log("Current Peers:", Array.from(peers));
  }, [peers]);

  const connectToRemoteStream = useCallback(async () => {
    const attemptReconnect = async (maxAttempts: number, delay: number): Promise<void> => {
      console.log("karwi: attemptReconnect");
      for (let i = 0; i < maxAttempts; i++) {
        try {
          console.log("karwi: 1");
          await signalingClient.connect();
          console.log("karwi: 2");
          toast({ title: "Reconnected", status: "success", duration: 3000 });
          console.log("karwi: 3");
          return;
        } catch (error) {
          console.log("karwi: 4");
          if (i < maxAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      console.log("karwi: 5");
      handleError(new Error("Failed to reconnect"), "Could not re-establish connection.");
    };

    try {
      // Establishing connection with the signaling server
      await signalingClient.connect();
      toast({ title: "Connected", status: "success", duration: 3000 });

      // Setting up the peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Using Google's public STUN server
      });
      peerConnectionRef.current = peerConnection;

      // Handling tracks received from the remote peer
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Sending ICE candidates to the remote peer
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          signalingClient.sendIceCandidate(event.candidate).catch((error) => {
            handleError(error, "Failed to send ICE candidate.");
          });
        }
      };

      // Creating and sending the initial offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingClient.sendOffer(offer);

      // Listening for an incoming offer
      signalingClient.onOffer(async (offer, peerId) => {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

          // Create an answer to the received offer
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          // Send the answer back to the initiating peer
          signalingClient.sendAnswer(answer);
        } catch (error) {
          handleError(error, "Error handling incoming offer.");
        }
      });

      // Handling answer from the remote peer
      signalingClient.onAnswer(async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // Adding ICE candidates received from the remote peer
      signalingClient.onIceCandidate(async (candidate) => {
        if (candidate) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      signalingClient.onDisconnect(async () => {
        toast({
          title: "Disconnected, attempting to reconnect...",
          status: "warning",
          duration: 3000,
        });
        await attemptReconnect(3, 5000); // Attempt to reconnect 3 times with a 5-second delay
      });

      // Handling renegotiation if needed
      peerConnection.onnegotiationneeded = async () => {
        try {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          signalingClient.sendOffer(offer);
        } catch (error) {
          console.error("Failed to create offer on negotiation needed", error);
        }
      };

      // Handling connection state changes
      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case "connected":
            toast({ title: "Connected", status: "success", duration: 3000 });
            break;
          case "disconnected":
          case "failed":
            handleError(
              new Error("Connection failed"),
              "Connection lost. Please try reconnecting.",
            );
            break;
          case "closed":
            toast({ title: "Disconnected", status: "warning", duration: 3000 });
            break;
          default:
            break;
        }
      };
    } catch (error) {
      handleError(error, "Failed to connect to remote stream.");
      await attemptReconnect(3, 5000);
    }

    return () => {
      signalingClient.disconnect();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [handleError, signalingClient, toast]);

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    if (peerConnection) {
      // Remove any existing tracks
      peerConnection.getSenders().forEach((sender) => {
        peerConnection.removeTrack(sender);
      });

      if (localStream) {
        // Add new tracks to the connection
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }
    }
  }, [localStream, signalingClient]);

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
