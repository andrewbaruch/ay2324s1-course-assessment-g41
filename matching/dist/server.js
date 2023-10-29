"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const complexity_subscriber_1 = __importDefault(require("./subscribers/complexity-subscriber"));
class Server {
    constructor() {
        const port = process.env.SERVER_PORT;
        if (!port) {
            console.log("Missing SERVER_PORT");
            process.exit();
        }
        this.port = port;
        this.app = (0, express_1.default)();
        this.configMiddleware();
        this.configRouter();
        // this.start();
        this.runOnStart();
    }
    configMiddleware() {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: '*',
        }));
    }
    configRouter() {
        // NOTE: Central router if necessary
        this.app.use("/", router_1.default);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port);
        });
    }
    runOnStart() {
        console.log("Running pubsub subscriber on server start");
        const complexitySubscriber = new complexity_subscriber_1.default();
        complexitySubscriber.start();
    }
}
exports.default = Server;
