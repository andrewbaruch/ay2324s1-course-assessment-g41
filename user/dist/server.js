"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./routes/router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
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
    }
    configMiddleware() {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, cors_1.default)({
            origin: '*',
        }));
    }
    configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/', router_1.default);
    }
    start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port);
        });
    }
}
exports.default = Server;
