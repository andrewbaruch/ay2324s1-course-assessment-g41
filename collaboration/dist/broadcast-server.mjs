import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);

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
export {
  broadcast_server_default as default
};
