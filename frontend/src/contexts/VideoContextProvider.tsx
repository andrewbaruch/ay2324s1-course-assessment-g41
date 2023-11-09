// context/VideoContextProvider.tsx
import { SignalingClient } from "@/@types/video";
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
    // Assume that signalingClient has methods to handle signaling
    // This would connect to your signaling server and join a specific room
    await signalingClient.connect();

    // Create a new RTCPeerConnection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302", // Using Google's public STUN server
        },
        // ... You can add more STUN/TURN servers as needed
      ],
    });

    // Set up event handlers for peer connection
    peerConnection.ontrack = (event) => {
      // Set the remote stream
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the remote peer via your signaling service
        signalingClient.sendIceCandidate(event.candidate);
      }
    };

    // Add local stream tracks to the peer connection
    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer via your signaling service
    signalingClient.sendOffer(offer);

    // Listen for the answer from the remote peer
    signalingClient.onAnswer(async (answer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // Listen for ICE candidates from the remote peer
    signalingClient.onIceCandidate(async (candidate) => {
      if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle the negotiationneeded event (in case renegotiation is needed)
    peerConnection.onnegotiationneeded = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingClient.sendOffer(offer);
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") {
        // Peers are connected and ready to communicate
        console.log("Peers connected!");
      }
    };

    // Clean up the peer connection when the component unmounts or the connection is closed
    return () => {
      peerConnection.close();
    };

    // Note: You would also need to handle disconnects and cleanup peerConnection when done
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
