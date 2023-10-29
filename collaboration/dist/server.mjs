import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/server.ts
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import expressWebsockets from "express-ws";

// src/broadcast-server.ts
import { Server as HocuspocusServer } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { SQLite } from "@hocuspocus/extension-sqlite";
var BroadcastServer = class {
  constructor(port) {
    this.broadcastWebsocketServer = this.createWebsocketServer(port);
  }
  handleConnection(websocket, request, context) {
    this.broadcastWebsocketServer.handleConnection(websocket, request, context);
  }
  createWebsocketServer(port) {
    return HocuspocusServer.configure({
      port,
      name: "PeerPrep Collaboration WebSocket Server",
      extensions: [
        new Logger(),
        new SQLite()
      ],
      onListen: async (data) => {
        console.log(data);
        console.log(`Broadcast server is listening on port "${data.port}"!`);
      },
      onConnect: async (data) => {
        console.log(data.socketId);
        console.log("connect");
      }
      // TOOD: add optional configurations for auth checks
      // 
      // async onAuthenticate(data) {
      //   if (data.token !== 'my-access-token') {
      //     throw new Error('Incorrect access token')
      //   }
      // },
      // Intercept HTTP requests
      // onRequest(data) {
      //   return new Promise((resolve, reject) => {
      //     const { response } = data
      //     // Respond with your custum content
      //     response.writeHead(200, { 'Content-Type': 'text/plain' })
      //     response.end('This is my custom response, yay!')
      //     // Rejecting the promise will stop the chain and no further
      //     // onRequest hooks are run
      //     return reject()
      //   })
      // },
    });
  }
};
var broadcast_server_default = BroadcastServer;

// src/routes/room-router.ts
import { Router } from "express";

// src/services/room-service.ts
import { generateSlug } from "random-word-slugs";

// src/clients/pg-knex.ts
var objection = __require("objection");
var { knexSnakeCaseMappers } = objection;
var knexPgClient = __require("knex")({
  client: "pg",
  connection: process.env.POSTGRES_COLLAB,
  // set min to 0 so all idle connections can be terminated
  pool: { min: 0, max: 10 },
  ...knexSnakeCaseMappers({ underscoreBeforeDigits: true })
});

// src/services/room-service.ts
var RoomService = class _RoomService {
  static async openRoom(room) {
    if (!room) {
      return;
    }
    const updatedRoom = await knexPgClient("Room").where("id", room.id).update({
      isOpen: true
    }, ["id", "isOpen", "name"]);
    console.log("updated room", updatedRoom);
  }
  static async closeRoom(roomId) {
    console.log("closing room", roomId);
    if (!roomId) {
      return;
    }
    const updatedRoom = await knexPgClient("Room").where("id", roomId).update({
      isOpen: false
    }, ["id", "isOpen", "name"]);
    console.log("closed room", updatedRoom);
  }
  static async createRoom(userId1, userId2) {
    _RoomService.validateUsers(userId1, userId2);
    const { roomName } = await _RoomService.generateRoomName();
    console.log("write into db");
    const room = await knexPgClient("Room").insert({
      userId1,
      userId2,
      name: roomName
    }, ["id", "name", "userId1", "userId2", "isOpen"]);
    console.log("complete db insertion", room);
    return room;
  }
  // TODO: @didy update validation logic on integration with user service
  static validateUsers(user1, user2) {
    console.log("validate users", user1, user2);
  }
  static async generateRoomName() {
    console.log("generating room name");
    let slug = "";
    while (true) {
      slug = generateSlug();
      const room = await knexPgClient("Room").where("name", slug).first();
      console.log("retrieved room", room);
      if (!room) {
        console.log("generated room name", slug);
        break;
      }
    }
    return { roomName: slug };
  }
};

// src/controllers/room-controller.ts
async function createRoom(req, res) {
  const { userId1, userId2 } = req.body;
  const room = await RoomService.createRoom(userId1, userId2);
  res.status(200).json({
    room
  });
}
async function closeRoom(req, res) {
  const { roomId } = req.params;
  await RoomService.closeRoom(parseInt(roomId));
  res.status(200).send();
}

// src/routes/room-router.ts
var roomRouter = Router();
roomRouter.post("/", createRoom);
roomRouter.put("/:roomId", closeRoom);
var room_router_default = roomRouter;

// src/server.ts
var Server = class {
  constructor() {
    const port = process.env.SERVER_PORT;
    if (!port) {
      console.log("Missing env varibale SERVER_PORT");
      process.exit();
    }
    if (!process.env.POSTGRES_COLLAB) {
      console.log("Missing env variable, POSTGRES_COLLAB for database");
      process.exit();
    }
    this.port = port;
    const { app } = expressWebsockets(express());
    this.app = app;
    this.broadcastServer = new broadcast_server_default(parseInt(port));
    this.configMiddleware();
    this.configRouter();
  }
  start() {
    this.app.listen(this.port, () => {
      console.log("Listening to port", this.port);
    });
  }
  configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors({
      origin: "*"
    }));
  }
  configRouter() {
    this.app.ws("/broadcast", (websocket, request, context) => {
      this.broadcastServer.handleConnection(websocket, request, context);
    });
    this.app.use("/room", room_router_default);
  }
};
var server_default = Server;
export {
  Server,
  server_default as default
};
