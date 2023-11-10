import { SignalingClient } from "@/@types/video";

export class WebSocketSignalingClient implements SignalingClient {
  private socket: WebSocket;

  // Add more properties and methods as needed for event handling
  private offerCallback?: (offer: RTCSessionDescriptionInit, peerId: string) => void;
  private answerCallback?: (answer: RTCSessionDescriptionInit, peerId: string) => void;
  private iceCandidateCallback?: (candidate: RTCIceCandidate, peerId: string) => void;
  private disconnectCallback?: () => void;

  constructor(private url: string) {
    this.socket = new WebSocket(url);

    // Set up WebSocket event handlers
    this.socket.onopen = () => {
      console.log("Signaling client connected");
    };

    this.socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "offer":
          this.offerCallback?.(data.offer, data.peerId);
          break;
        case "answer":
          this.answerCallback?.(data.answer, data.peerId);
          break;
        case "ice-candidate":
          this.iceCandidateCallback?.(data.candidate, data.peerId);
          break;
        // karwi: Handle other messages or events as needed: new-peer, peer-disconnected
      }
    };

    this.socket.onclose = () => {
      this.disconnectCallback?.();
      console.log("Signaling client disconnected");
    };
  }

  async connect(): Promise<void> {
    if (this.socket.readyState !== this.socket.OPEN) {
      return new Promise((resolve, reject) => {
        this.socket.onopen = () => resolve();
        this.socket.onerror = (event) => reject(event);
      });
    }
  }

  async disconnect(): Promise<void> {
    this.socket.close();
  }

  async sendOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    this.socket.send(JSON.stringify({ type: "offer", offer }));
  }

  // Implement the rest of the methods...
  async sendAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    this.socket.send(JSON.stringify({ type: "answer", answer }));
  }

  async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    this.socket.send(JSON.stringify({ type: "ice-candidate", candidate }));
  }

  onOffer(callback: (offer: RTCSessionDescriptionInit, peerId: string) => void): void {
    this.offerCallback = callback;
  }

  onAnswer(callback: (answer: RTCSessionDescriptionInit, peerId: string) => void): void {
    this.answerCallback = callback;
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate, peerId: string) => void): void {
    this.iceCandidateCallback = callback;
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback;
  }
}
