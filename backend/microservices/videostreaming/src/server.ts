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
    console.log(`Server: Initialized on port ${this.port}`);
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

    console.log('Server: Configuring middleware');
  }

  // karwi: authentication
  // karwi: room authentication
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  private configWebSocket() {
    console.log('Server: Configuring WebSocket server');
    this.wsServer.on('connection', (ws: ExtendedWebSocket, req) => {
      // karwi: use user id
      ws.id = uuidv4();
      console.log(`Server: WebSocket connection established with ID: ${ws.id}`);

      const url = req.url
        ? new URL(req.url, `http://${req.headers.host}`)
        : null;
      const roomId = url ? url.searchParams.get('roomId') : null;

      if (roomId) {
        console.log(`Server: Adding WebSocket ID ${ws.id} to room ${roomId}`);
        this.addToRoom(roomId, ws);

        ws.on('message', async (message) => {
          console.log(
            `Server: Message received from WebSocket ID ${ws.id}: ${message}`
          );
          const messageString =
            typeof message === 'string' ? message : message.toString();
          await this.handleMessage(roomId, messageString, ws);
        });

        ws.on('close', async () => {
          console.log(`Server: WebSocket ID ${ws.id} closed connection`);
          await this.removeFromRoom(roomId, ws);
        });
      } else {
        console.log(`Server: WebSocket connection from ${ws.id} lacks room ID`);
      }
    });
  }

  // karwi: ensure no duplicate user
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  private async addToRoom(roomId: string, ws: ExtendedWebSocket) {
    console.log(`Server: Adding WebSocket ID ${ws.id} to room ${roomId}`);
    await this.redisClient.sAdd(roomId, ws.id);

    const room = await this.redisClient.sMembers(roomId);
    console.log(
      `Server: Notifying peers in room ${roomId} about new peer ${ws.id}`
    );
    room.forEach((peerId) => {
      if (peerId !== ws.id) {
        this.sendMessage(peerId, { type: 'new-peer', peerId: ws.id });
      }
    });
  }

  private async removeFromRoom(roomId: string, ws: ExtendedWebSocket) {
    console.log(`Server: Removing WebSocket ID ${ws.id} from room ${roomId}`);
    await this.redisClient.sRem(roomId, ws.id);

    const room = await this.redisClient.sMembers(roomId);
    console.log(
      `Server: Notifying peers in room ${roomId} about disconnected peer ${ws.id}`
    );
    room.forEach((peerId) => {
      this.sendMessage(peerId, { type: 'peer-disconnected', peerId: ws.id });
    });
  }

  private async handleMessage(
    roomId: string,
    message: string,
    ws: ExtendedWebSocket
  ) {
    console.log(
      `Server: Handling message from WebSocket ID ${ws.id} in room ${roomId}`
    );
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`Server: Parsed message type ${parsedMessage.type}`);

      switch (parsedMessage.type) {
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          console.log(
            `Server: Broadcasting ${parsedMessage.type} to room ${roomId}`
          );
          await this.broadcastToRoom(roomId, parsedMessage, ws.id);
          break;
        // Additional message types as needed
      }
    } catch (error) {
      console.error('Server: Error handling message:', error);
    }
  }

  private sendMessage(peerId: string, message: object) {
    console.log(`Server: Sending message to peer ${peerId}`);
    const peerWs = Array.from(this.wsServer.clients).find(
      (client) => (client as ExtendedWebSocket).id === peerId
    );

    if (peerWs && peerWs.readyState === WebSocket.OPEN) {
      (peerWs as ExtendedWebSocket).send(JSON.stringify(message));
      console.log(`Server: Message sent to peer ${peerId}`);
    } else {
      console.log(`Server: Peer ${peerId} not found or connection not open`);
    }
  }

  private async broadcastToRoom(
    roomId: string,
    message: object,
    senderId: string
  ) {
    console.log(
      `Server: Broadcasting message to room ${roomId} from sender ${senderId}`
    );
    const room = await this.redisClient.sMembers(roomId);
    room.forEach((peerId) => {
      if (peerId !== senderId) {
        this.sendMessage(peerId, message);
      }
    });
  }

  public start() {
    console.log(`Server: Starting server on port ${this.port}`);
    this.httpServer.listen(this.port, () => {
      console.log(`Server: Running on port ${this.port}`);
    });
  }
}

export default Server;
