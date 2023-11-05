import { Extension, onAuthenticatePayload, onChangePayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as BroadcastController from "@/controllers/broadcast-controller";

class BroadcastRouter implements Extension {
  async onAuthenticate(data: onAuthenticatePayload) {
    BroadcastController.authenticateUser(data)
  }

  async onStoreDocument(data: onStoreDocumentPayload) {
    BroadcastController.saveAttempt(data)
  }

  async onChange(data: onChangePayload) {
    BroadcastController.handleChangeData(data)
  }
}

const broadcastRouter = new BroadcastRouter()

export default broadcastRouter;