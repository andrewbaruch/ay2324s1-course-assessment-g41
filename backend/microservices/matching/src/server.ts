import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import routes from "@/routes/matching-router";
import ComplexitySubscriber from "./subscribers/complexity-subscriber";

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
    this.configMiddleware();
    this.configRouter();
    // this.start();
    this.runOnStart();
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "*",
      })
    );
  }

  private configRouter() {
    // NOTE: Central router if necessary
    this.app.use("/", routes);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("listening to port", this.port);
    });
  }

  private runOnStart() {
    console.log("Running pubsub subscriber on server start");
    console.log("woohoo==============");
    const complexitySubscriber = new ComplexitySubscriber();
    complexitySubscriber.start();
  }
}

export default Server;
