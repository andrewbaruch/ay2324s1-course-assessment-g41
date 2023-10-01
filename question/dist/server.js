"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const question_router_1 = __importDefault(require("./routes/question-router"));
class Server {
    constructor() {
        this.port = process.env.SERVER_PORT;
        this.app = (0, express_1.default)();
        this.configMiddleware();
        this.configRouter();
    }
    configMiddleware() {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
    }
    configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/question', question_router_1.default);
    }
    start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port);
        });
    }
}
exports.default = Server;
