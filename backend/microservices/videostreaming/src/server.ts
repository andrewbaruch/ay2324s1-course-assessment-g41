import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketAuthMiddleware } from './middlewares/auth-middleware';

class ServerApp {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private port: number | string;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      path: '/socket.io', // Set custom path here
    });
    this.port = process.env.SERVER_PORT || 3000;
    this.configMiddleware();
    this.configSocket();
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));
    this.app.use(cors({ origin: '*' }));
  }

  // karwi: room authentication
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  // karwi: ensure no duplicate user
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  private configSocket() {
    this.io.use(socketAuthMiddleware);

    this.io.on('connection', async (socket) => {
      console.log(`Connected client with ID: ${socket.id}`);
      const roomId = socket.handshake.query.roomId as string;

      if (roomId) {
        // Fetch sockets in the room
        this.io
          .in(roomId)
          .fetchSockets()
          .then((sockets) => {
            if (sockets.length < 2) {
              console.log(`Client ${socket.id} joining room: ${roomId}`);
              socket.join(roomId);
            } else {
              console.log(
                `Room ${roomId} is full. Client ${socket.id} cannot join.`
              );
              // Optionally, send a message back to the client
              socket.emit('roomFull', roomId);
            }
          })
          .catch((error) => {
            console.error(`Error fetching sockets for room ${roomId}:`, error);
          });
      }

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        if (roomId) {
          // Inform other clients in the room about the disconnection
          socket.to(roomId).emit('peerDisconnected', { peerId: socket.id });

          // Additional cleanup if needed
          console.log(`Client ${socket.id} left room: ${roomId}`);
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

      socket.on('streamStopped', (data) => {
        console.log(
          `Server: Received 'streamStopped' event from ${socket.id} for room ${data.roomId}`
        );
        socket.to(data.roomId).emit('streamStopped');
      });

      // Additional socket event listeners as needed
    });
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default ServerApp;
