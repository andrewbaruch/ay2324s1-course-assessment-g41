import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

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
export {
  RoomService
};
