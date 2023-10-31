"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJWT = void 0;
const auth_service_1 = __importDefault(require("../services/auth-service"));
if (!process.env.ACCESS_COOKIE_KEY) {
    console.log("Missing ACCESS_COOKIE_KEY");
    process.exit();
}
const accessTokenKey = process.env.ACCESS_COOKIE_KEY;
function authJWT(req, res, next) {
    const token = req.cookies[accessTokenKey];
    if (token) {
        try {
            res.locals.userId = auth_service_1.default.verifyAccessToken(token).userId;
            next();
        }
        catch (err) {
            res.status(401).send();
        }
    }
    else {
        res.status(401).send();
    }
}
exports.authJWT = authJWT;
