"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoSession = exports.getUserInfoJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserInfoJWT(req, res, next) {
    var _a;
    console.log("JWT");
    // TODO: Remove after auth server
    if (true || process.env.EXE_ENV === "DEV") {
        req.params.userId = "uid";
        next();
    }
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT || 'DEV_JWT');
            req.params.userId = decodedToken.userId;
            next();
        }
        catch (error) {
            res.status(401);
        }
    }
    else {
        res.status(401);
    }
}
exports.getUserInfoJWT = getUserInfoJWT;
function getUserInfoSession(req, res, next) {
    // TODO: GET SESSION
    // TODO: Remove after auth server
    if (process.env.EXE_ENV === "DEV") {
        req.params.userId = "uid";
        next();
    }
    const userId = "uid";
    if (userId) {
        req.params.userId = userId;
        next();
    }
    else {
        res.status(401);
    }
}
exports.getUserInfoSession = getUserInfoSession;
