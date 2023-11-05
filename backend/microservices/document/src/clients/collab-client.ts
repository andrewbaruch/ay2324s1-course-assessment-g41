import axios from "axios";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const collabClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});

const doesUserHaveAccessToRoom = async (userId: string, roomName: string) => {
  const response = await collabClient.get(`/room/${roomName}/access`, {
    data: {
      userId
    }
  })
  console.log(`Received ${JSON.stringify(response.status)}, ${JSON.stringify(response.data)} from collab-service`)
  if (response.status !== 200) {
    throw new Error("User does not have access to room")
  }
}

const isRoomOpen = async (roomName: string) => {
  const response = await collabClient.get(`/room/${roomName}/status`)
  console.log(`Received ${JSON.stringify(response.data)} from collab-service`)
  const { isOpen }: { isOpen: boolean } = response.data
  if (!isOpen) {
    throw new Error("Room is not opened.")
  }
}

export {
  doesUserHaveAccessToRoom,
  isRoomOpen
}


