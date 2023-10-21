import express from "express";
import routes from "@/routes/router";

import { processMatching } from "./matchingSubscriber";

class Server {
  private app;
  private port;

  constructor() {
    const port = process.env.SERVER_PORT;
    if (!port) {
      console.log("Missing SERVER_PORT");
      process.exit();
    }

    this.port = port;
    this.app = express();
    this.configRouter();
    // this.start();
    this.runOnStart();
  }

  private configRouter() {
    // NOTE: Central router if necessary
    this.app.use("/", routes);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("listening to port cb", this.port);
    });
  }

  private runOnStart() {
    console.log("Running pubsub ---- oicb subscriber on server start");
    console.log("haiya wtf--21348675--");
    processMatching();
  }
}

export default Server;
