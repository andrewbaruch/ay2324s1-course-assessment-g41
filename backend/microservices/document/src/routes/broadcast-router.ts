import { Extension, onAuthenticatePayload, onChangePayload, onStatelessPayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as BroadcastController from "@/controllers/broadcast-controller";

class BroadcastRouter implements Extension {
  async onAuthenticate(data: onAuthenticatePayload) {
    await BroadcastController.checkAuthForUser(data)
  }

  /**
   * Calls to store the attempt at debounced. 
   * This mimics an "auto-save" feature. 
   * @param data contains the data of the document to save iteratively.
   */
  async onStoreDocument(data: onStoreDocumentPayload) {
    await BroadcastController.saveAttempt(data)
  }

  async onChange(data: onChangePayload) {
    await BroadcastController.handleChangeData(data);
  }

  async onStateless(data: onStatelessPayload) {
    await BroadcastController.handleStatelessMessage(data);
  }
}

const broadcastRouter = new BroadcastRouter()

export default broadcastRouter;