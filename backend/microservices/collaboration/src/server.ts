import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import express from 'express'
import expressWebsockets from "express-ws";
import BroadcastServer from './broadcast-server';
import roomRouter from './routes/room-router';

export class Server {
  private app
  private port
  private broadcastServer: BroadcastServer
  
  constructor() {
    const port = process.env.SERVER_PORT
    if (!port) {
      console.log("Missing env varibale SERVER_PORT")
      process.exit()
    }

    if (!process.env.POSTGRES_COLLAB) {
      console.log("Missing env variable, POSTGRES_COLLAB for database")
      process.exit()
    }

    if (!process.env.JWT_SECRET || !process.env.ACCESS_COOKIE_KEY || !process.env.REFRESH_COOKIE_KEY) {
      console.log("Missing JWT secret for decryption")
      process.exit()
    }

    this.port = port
    const { app } = expressWebsockets(express())
    this.app = app
    this.broadcastServer = new BroadcastServer(parseInt(port))
    this.configMiddleware()
    this.configRouter()
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("Listening to port", this.port)
    })
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
    this.app.use(cors({
      origin: '*',
    }));
  }

  private configRouter() {
    // let websocket and express server share the same instance
    // websocket requests will be routed to wsServer
    this.app.ws('/broadcast', (websocket, request, context) => {
      this.broadcastServer.handleConnection(websocket, request, context)
    })

    this.app.use('/room', roomRouter)
  }
}

export default Server;