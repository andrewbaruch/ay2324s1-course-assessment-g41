"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var user_router_1 = require("routes/user-router");
var Server = /** @class */ (function () {
    function Server() {
        this.port = process.env.PORT;
        this.app = (0, express_1.default)();
        this.configMiddleware();
        this.configRouter();
    }
    Server.prototype.configMiddleware = function () {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
    };
    Server.prototype.configRouter = function () {
        // NOTE: Central router if necessary
        this.app.use('/user', user_router_1.default);
    };
    Server.prototype.start = function () {
        // TODO: start up config
        this.app.listen(this.port);
    };
    return Server;
}());
exports.default = Server;
