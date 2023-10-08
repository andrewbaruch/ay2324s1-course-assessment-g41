import { Server } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import { SQLite } from '@hocuspocus/extension-sqlite'

/**
 * Reference: https://tiptap.dev/hocuspocus/server/configuration
 * 
 * The Hocuspocus Server is a websocket backend that integrates Yjs.
 */
const server = Server.configure({
  port: 1234,
  // TODO: revamp the address
  address: '127.0.0.1',
  name: 'PeerPrep Collaboration WebSocket Server',
  extensions: [
    new Logger(),
    new SQLite(),
  ],

  // TOOD: add optional configurations for auth checks
  // async onAuthenticate(data) {
  //   if (data.token !== 'my-access-token') {
  //     throw new Error('Incorrect access token')
  //   }
  // },

  // Test error handling
  // async onConnect(data) {
  //   throw new Error('CRASH')
  // },

  // async onConnect(data) {
  //   await new Promise((resolve, reject) => setTimeout(() => {
  //     // @ts-ignore
  //     reject()
  //   }, 1337))
  // },

  // async onConnect(data) {
  //   await new Promise((resolve, reject) => setTimeout(() => {
  //     // @ts-ignore
  //     resolve()
  //   }, 1337))
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

server.listen()