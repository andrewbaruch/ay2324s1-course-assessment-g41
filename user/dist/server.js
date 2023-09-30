"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("./routes/user-router"));
class Server {
    constructor() {
        var _a;
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
        this.app = (0, express_1.default)();
        this.configMiddleware();
        this.configRouter();
    }
    configMiddleware() {
        // this.app.use(bodyParser.urlencoded({ extended:true }));
        // this.app.use(bodyParser.json({ limit: '1mb' })); 
    }
    configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/user', user_router_1.default);
    }
    start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port);
        });
    }
}
exports.default = Server;
