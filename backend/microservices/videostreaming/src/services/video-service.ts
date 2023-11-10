class VideoService {
  async saveOffer(
    offer: RTCSessionDescriptionInit,
    roomId: string
  ): Promise<void> {
    // Implement logic to store offer
  }

  async saveAnswer(
    answer: RTCSessionDescriptionInit,
    roomId: string
  ): Promise<void> {
    // Implement logic to store answer
  }

  async saveIceCandidate(
    candidate: RTCIceCandidateInit,
    roomId: string
  ): Promise<void> {
    // Implement logic to store ICE candidate
  }
}

const videoService = new VideoService();
export default videoService;
