import axios from "axios";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const collabClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
  }
});

const createRoom = async (userId1: string, userId2: string) => {
  await collabClient.put(`/room/${1}`)
  return await collabClient.post("/room", {
    userId1, userId2
  })
}

const closeRoom = async (roomId: number) => {
  await collabClient.put(`/${roomId}`)
}

export {
  createRoom, closeRoom
}


