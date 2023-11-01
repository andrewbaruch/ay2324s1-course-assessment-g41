import { Extension, onAuthenticatePayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as AuthController from "@/controllers/auth"
import * as StoreController from "@/controllers/store"

class BroadcastRouter implements Extension {
  async onAuthenticate(data: onAuthenticatePayload) {
    AuthController.authenticateUser(data)
  }

  async onStoreDocument(data: onStoreDocumentPayload) {
    StoreController.saveAttempt(data)
  }
}

const broadcastRouter = new BroadcastRouter()

export default broadcastRouter;