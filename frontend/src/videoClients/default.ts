import { SignalingClient } from "@/@types/video";

export class WebSocketSignalingClient implements SignalingClient {
  private socket: WebSocket | null = null;

  // Add more properties and methods as needed for event handling
  private offerCallback?: (offer: RTCSessionDescriptionInit, peerId: string) => void;
  private answerCallback?: (answer: RTCSessionDescriptionInit, peerId: string) => void;
  private iceCandidateCallback?: (candidate: RTCIceCandidate, peerId: string) => void;
  private disconnectCallback?: () => void;
  private newPeerCallback?: (peerId: string) => void;
  private peerDisconnectedCallback?: (peerId: string) => void;

  constructor(private url: string) {
    // Store the URL but don't initialize the WebSocket here
  }

  private setupWebSocket(socket: WebSocket): void {
    socket.onmessage = (event) => {
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
        case "new-peer":
          this.newPeerCallback?.(data.peerId);
          break;
        case "peer-disconnected":
          this.peerDisconnectedCallback?.(data.peerId);
          break;
      }
    };

    socket.onclose = () => {
      this.disconnectCallback?.();
    };
  }

  async connect(): Promise<void> {
    // Initialize the WebSocket connection
    this.socket = new WebSocket(this.url);

    // Set up the event handlers
    this.setupWebSocket(this.socket);

    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.onopen = () => {
          console.log("WebSocket connected");
          resolve();
        };
        this.socket.onerror = (event) => {
          console.error("WebSocket connection error:", event);
          reject(event);
        };
      }
    });
  }

  async disconnect(): Promise<void> {
    this.socket?.close();
  }

  async sendOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    this.socket?.send(JSON.stringify({ type: "offer", offer }));
  }

  // Implement the rest of the methods...
  async sendAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    this.socket?.send(JSON.stringify({ type: "answer", answer }));
  }

  async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    this.socket?.send(JSON.stringify({ type: "ice-candidate", candidate }));
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

  onNewPeer(callback: (peerId: string) => void): void {
    this.newPeerCallback = callback;
  }

  onPeerDisconnected(callback: (peerId: string) => void): void {
    this.peerDisconnectedCallback = callback;
  }
}
