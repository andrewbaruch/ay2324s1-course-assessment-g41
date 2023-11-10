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
        console.error("VideoContext: Error event:", error);
      } else {
        console.error("VideoContext: Error object:", error);
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

  // Handle new peer joining
  const handleNewPeer = useCallback((peerId: string) => {
    console.log(`New peer joined: ${peerId}`);
    setPeers((prevPeers) => new Set([...prevPeers, peerId]));
    // Additional logic for a new peer (e.g., create RTCPeerConnection, UI update)
  }, []);

  // Handle peer disconnection
  const handlePeerDisconnected = useCallback((peerId: string) => {
    console.log(`Peer disconnected: ${peerId}`);
    setPeers((prevPeers) => {
      const updatedPeers = new Set(prevPeers);
      updatedPeers.delete(peerId);
      return updatedPeers;
    });
    // Additional cleanup logic for the disconnected peer
  }, []);

  useEffect(() => {
    console.log("VideoContext: Setting up signaling client callbacks");
    signalingClient.onNewPeer(handleNewPeer);
    signalingClient.onPeerDisconnected(handlePeerDisconnected);

    // ... other initialization code ...

    return () => {
      console.log("VideoContext: Cleaning up signaling client callbacks");
      // Clean up on unmount or when dependencies change
      signalingClient.onNewPeer(() => {});
      signalingClient.onPeerDisconnected(() => {});
    };
  }, [handleNewPeer, handlePeerDisconnected, signalingClient]);

  useEffect(() => {
    console.log("VideoContext: Peers state updated", Array.from(peers));
  }, [peers]);

  const connectToRemoteStream = useCallback(async () => {
    console.log("VideoContext: Connecting to remote stream");

    const attemptReconnect = async (maxAttempts: number, delay: number): Promise<void> => {
      console.log(`VideoContext: Attempting to reconnect. Max attempts: ${maxAttempts}`);
      for (let i = 0; i < maxAttempts; i++) {
        console.log(`VideoContext: Reconnect attempt ${i + 1}`);
        try {
          await signalingClient.connect();
          toast({ title: "Reconnected", status: "success", duration: 3000 });
          console.log("VideoContext: Successfully reconnected");
          return;
        } catch (error) {
          console.error("VideoContext: Reconnect attempt failed", error);
          if (i < maxAttempts - 1) {
            console.log(`VideoContext: Waiting ${delay}ms before next reconnect attempt`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      console.log("VideoContext: All reconnect attempts failed");
      handleError(new Error("Failed to reconnect"), "Could not re-establish connection.");
    };

    try {
      await signalingClient.connect();
      console.log("VideoContext: Connected to signaling server");
      toast({ title: "Connected", status: "success", duration: 3000 });

      // Peer connection setup
      console.log("VideoContext: Setting up peer connection");
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = peerConnection;

      peerConnection.ontrack = (event) => {
        console.log("VideoContext: Received new track", event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("VideoContext: Sending ICE candidate", event.candidate);
          signalingClient.sendIceCandidate(event.candidate).catch((error) => {
            handleError(error, "Failed to send ICE candidate.");
          });
        }
      };

      const offer = await peerConnection.createOffer();
      console.log("VideoContext: Created offer", offer);
      await peerConnection.setLocalDescription(offer);
      signalingClient.sendOffer(offer);

      signalingClient.onOffer(async (offer, peerId) => {
        console.log(`VideoContext: Received offer from peer ${peerId}`, offer);
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          console.log("VideoContext: Created answer", answer);
          await peerConnection.setLocalDescription(answer);
          signalingClient.sendAnswer(answer);
        } catch (error) {
          handleError(error, "Error handling incoming offer.");
        }
      });

      signalingClient.onAnswer(async (answer) => {
        console.log("VideoContext: Received answer", answer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      signalingClient.onIceCandidate(async (candidate) => {
        console.log("VideoContext: Received ICE candidate", candidate);
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      signalingClient.onDisconnect(async () => {
        console.log("VideoContext: Disconnected from signaling server, attempting to reconnect");
        await attemptReconnect(3, 5000);
      });

      peerConnection.onnegotiationneeded = async () => {
        console.log("VideoContext: Negotiation needed");
        try {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          signalingClient.sendOffer(offer);
        } catch (error) {
          console.error("Failed to create offer on negotiation needed", error);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        console.log(
          `VideoContext: Peer connection state changed to ${peerConnection.connectionState}`,
        );
        switch (peerConnection.connectionState) {
          case "connected":
            console.log("VideoContext: Peer connection established");
            toast({ title: "Connected", status: "success", duration: 3000 });
            break;
          case "disconnected":
            console.log("VideoContext: Peer connection disconnected");
            handleError(
              new Error("Connection failed"),
              "Connection lost. Please try reconnecting.",
            );
            break;
          case "failed":
            console.log("VideoContext: Peer connection failed");
            handleError(
              new Error("Connection failed"),
              "Connection failed. Please try reconnecting.",
            );
            break;
          case "closed":
            console.log("VideoContext: Peer connection closed");
            toast({ title: "Disconnected", status: "warning", duration: 3000 });
            break;
          default:
            console.log(
              `VideoContext: Peer connection state is now ${peerConnection.connectionState}`,
            );
            break;
        }
      };
    } catch (error) {
      handleError(error, "Failed to connect to remote stream.");
      await attemptReconnect(3, 5000);
    }

    return () => {
      console.log("VideoContext: Disconnecting from remote stream");
      signalingClient.disconnect();
      if (peerConnectionRef.current) {
        console.log("VideoContext: Closing peer connection");
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [handleError, signalingClient, toast]);

  useEffect(() => {
    console.log("VideoContext: Local stream updated");

    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      console.log("VideoContext: Updating peer connection with new local stream");

      // Remove any existing tracks
      const senders = peerConnection.getSenders();
      console.log(
        `VideoContext: Removing ${senders.length} existing sender(s) from peer connection`,
      );
      senders.forEach((sender) => {
        console.log(`VideoContext: Removing sender: ${sender.track?.kind}`);
        peerConnection.removeTrack(sender);
      });

      if (localStream) {
        console.log("VideoContext: Adding new tracks from local stream to peer connection");
        // Add new tracks to the connection
        localStream.getTracks().forEach((track) => {
          console.log(`VideoContext: Adding track to peer connection: ${track.kind}`);
          peerConnection.addTrack(track, localStream);
        });
      } else {
        console.log("VideoContext: Local stream is null, no tracks to add");
      }
    } else {
      console.log("VideoContext: Peer connection not established, cannot update tracks");
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
