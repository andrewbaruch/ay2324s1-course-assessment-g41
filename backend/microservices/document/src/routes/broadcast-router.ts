import { Extension, onAuthenticatePayload, onChangePayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as BroadcastController from "@/controllers/broadcast-controller";

class BroadcastRouter implements Extension {
  async onAuthenticate(data: onAuthenticatePayload) {
    await BroadcastController.checkAuthForUser(data)
  }

  async onStoreDocument(data: onStoreDocumentPayload) {
    await BroadcastController.saveAttempt(data)
  }

  async onChange(data: onChangePayload) {
    await BroadcastController.handleChangeData(data)
  }
}

const broadcastRouter = new BroadcastRouter()

export default broadcastRouter;