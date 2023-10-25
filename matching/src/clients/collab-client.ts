import axios from "axios";
const { COLLAB_SERVICE_ENDPOINT } = process.env

const collabClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
});

const createRoom = async (userId1: string, userId2: string) => {
  return await collabClient.post("/", {
    userId1, userId2
  })
}

const closeRoom = async (roomId: string) => {
  await collabClient.put(`/${roomId}`)
}

export {
  createRoom, closeRoom
}


