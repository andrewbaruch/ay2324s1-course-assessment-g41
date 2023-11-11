import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

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

  private configSocket() {
    this.io.on('connection', (socket) => {
      console.log(`Connected client with ID: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on('callUser', (data) => {
        this.io.to(data.userToCall).emit('callUser', {
          signal: data.signalData,
          from: socket.id,
          name: data.name,
        });
      });

      socket.on('answerCall', (data) => {
        this.io.to(data.to).emit('callAccepted', data.signal);
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
