import express from 'express'
import { WebSocket } from 'ws'
import { Server as HocuspocusServer } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import { SQLite } from '@hocuspocus/extension-sqlite'

/**
 * Handles the broadcast logic between multiple clients via Yjs. 
 * 
 * Reference: https://tiptap.dev/hocuspocus/server/configuration
 * The Hocuspocus Server is a websocket backend that integrates Yjs.
 */
class BroadcastServer {
  readonly broadcastWebsocketServer: typeof HocuspocusServer

  constructor(port: number) {
    this.broadcastWebsocketServer = this.createWebsocketServer(port)
  }

  public handleConnection(websocket: WebSocket, request: express.Request, context: express.NextFunction) {
    this.broadcastWebsocketServer.handleConnection(websocket, request, context)
  }

  private createWebsocketServer(port: number) {
    return HocuspocusServer.configure({
      port: port,
      name: 'PeerPrep Collaboration WebSocket Server',
      extensions: [
        new Logger(),
        new SQLite(),
      ],
      onListen: async (data) => {
        console.log(data)
        // Output some information
        console.log(`Broadcast server is listening on port "${data.port}"!`);
      },
      onConnect: async (data) => {
        // validation logic here for the client
        console.log(data.socketId)
        console.log('connect')
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
    })
  }  
}
export default BroadcastServer
