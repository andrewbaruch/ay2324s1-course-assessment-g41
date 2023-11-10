import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

// karwi: refactor into files
interface ExtendedWebSocket extends WebSocket {
  id: string;
}

class Server {
  private app;
  private port;
  private httpServer;
  private wsServer;
  private redisClient;

  constructor() {
    const port = process.env.SERVER_PORT || 3000;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.wsServer = new WebSocketServer({
      server: this.httpServer,
      path: '/signaling',
    });
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redisClient = createClient({ url: redisUrl });
    this.port = port;
    this.configMiddleware();
    this.configWebSocket();
  }

  private async configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));
    this.app.use(cors({ origin: '*' }));

    // Connect to Redis
    try {
      await this.redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  private configWebSocket() {
    this.wsServer.on('connection', (ws: ExtendedWebSocket, req) => {
      ws.id = uuidv4(); // Assign a unique ID to the WebSocket connection
      const url = req.url
        ? new URL(req.url, `http://${req.headers.host}`)
        : null;
      const roomId = url ? url.searchParams.get('roomId') : null;

      if (roomId) {
        this.addToRoom(roomId, ws);

        ws.on('message', async (message) => {
          // Ensure the message is a string
          const messageString =
            typeof message === 'string' ? message : message.toString();
          await this.handleMessage(roomId, messageString, ws);
        });

        ws.on('close', async () => {
          await this.removeFromRoom(roomId, ws);
        });
      }
    });
  }

  private async addToRoom(roomId: string, ws: ExtendedWebSocket) {
    // Add the WebSocket ID to the room
    await this.redisClient.sAdd(roomId, ws.id);

    // Notify existing members about the new peer
    const room = await this.redisClient.sMembers(roomId);
    room.forEach((peerId) => {
      if (peerId !== ws.id) {
        this.sendMessage(peerId, { type: 'new-peer', peerId: ws.id });
      }
    });
  }

  private async removeFromRoom(roomId: string, ws: ExtendedWebSocket) {
    // Remove the WebSocket ID from the room
    await this.redisClient.sRem(roomId, ws.id);

    // Notify remaining members about the disconnected peer
    const room = await this.redisClient.sMembers(roomId);
    room.forEach((peerId) => {
      this.sendMessage(peerId, { type: 'peer-disconnected', peerId: ws.id });
    });
  }

  private async handleMessage(
    roomId: string,
    message: string,
    ws: ExtendedWebSocket
  ) {
    try {
      const parsedMessage = JSON.parse(message);

      // Handle different types of messages
      switch (parsedMessage.type) {
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          await this.broadcastToRoom(roomId, parsedMessage, ws.id);
          break;
        // Add handling for other message types as needed
      }
    } catch (error) {
      console.error('Error handling message:', error);
      // Optionally send error message back to client
    }
  }

  private sendMessage(peerId: string, message: object) {
    const peerWs = Array.from(this.wsServer.clients).find(
      (client) => (client as ExtendedWebSocket).id === peerId
    );

    if (peerWs && peerWs.readyState === WebSocket.OPEN) {
      (peerWs as ExtendedWebSocket).send(JSON.stringify(message));
    }
  }

  private async broadcastToRoom(
    roomId: string,
    message: object,
    senderId: string
  ) {
    const room = await this.redisClient.sMembers(roomId);
    room.forEach((peerId) => {
      if (peerId !== senderId) {
        this.sendMessage(peerId, message);
      }
    });
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
