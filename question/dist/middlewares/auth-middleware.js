"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenKey = "PEERPREPACCESSTOKEN";
const secret = process.env.JWT_SECRET;
if (!secret) {
    console.log("Missing JWT_SECRET");
    process.exit();
}
function authJWT(req, res, next) {
    if (process.env.SKIP_AUTH == 'TRUE') {
        next();
    }
    
    const token = req.cookies[accessTokenKey];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            res.locals.userId = decoded.userId;
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
