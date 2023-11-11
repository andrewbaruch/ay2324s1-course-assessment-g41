import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';

class ServerApp {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private redisClient: any;
  private port: number | string;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redisClient = createClient({ url: redisUrl });
    this.port = process.env.SERVER_PORT || 3000;
    this.configMiddleware();
    this.configSocket();
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));
    this.app.use(cors({ origin: '*' }));
  }

  // karwi: authentication
  // karwi: room authentication
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  // karwi: ensure no duplicate user
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  // karwi: remove redis client
  private configSocket() {
    this.io.on('connection', async (socket) => {
      console.log(`Connected client with ID: ${socket.id}`);
      const roomId = socket.handshake.query.roomId as string;

      if (roomId) {
        console.log(`Client ${socket.id} joining room: ${roomId}`);
        await this.addToRoom(roomId, socket.id);
        socket.join(roomId);
      }

      socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
        if (roomId) {
          await this.removeFromRoom(roomId, socket.id);
        }
      });

      socket.on('callUser', (data) => {
        console.log(`Broadcasting call signal in room: ${data.roomId}`);
        socket
          .to(data.roomId)
          .emit('callUser', { signal: data.signalData, name: data.name });
      });

      socket.on('answerCall', (data) => {
        console.log(`Broadcasting answer signal in room: ${data.roomId}`);
        socket.to(data.roomId).emit('callAccepted', data.signal);
      });

      // Additional socket event listeners as needed
    });
  }

  private async addToRoom(roomId: string, clientId: string) {
    await this.redisClient.sAdd(roomId, clientId);
    console.log(`Added client ${clientId} to room ${roomId}`);
  }

  private async removeFromRoom(roomId: string, clientId: string) {
    await this.redisClient.sRem(roomId, clientId);
    console.log(`Removed client ${clientId} from room ${roomId}`);
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default ServerApp;
