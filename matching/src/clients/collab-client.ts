import axios from "axios";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const collabClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
});

const createRoom = async (userId1: string, userId2: string) => {
  return await collabClient.post("/room", {
    userId1, userId2
  })
}

const closeRoom = async (roomId: string) => {
  await collabClient.put(`/${roomId}`)
}

export {
  createRoom, closeRoom
}


