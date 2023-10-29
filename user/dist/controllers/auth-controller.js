"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkAuth = exports.refresh = exports.googleRedirect = exports.googleAuth = void 0;
const auth_service_1 = __importDefault(require("../services/auth-service"));
const user_service_1 = __importDefault(require("../services/user-service"));
const testEmail = "example@email.com";
const cookieConfig = {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
};
if (!process.env.LOGIN_REDIRECT_URL) {
    console.log("Missing LOGIN_REDIRECT_URL");
    process.exit();
}
const loginRedirectURL = process.env.LOGIN_REDIRECT_URL;
if (!process.env.ACCESS_COOKIE_KEY) {
    console.log("Missing ACCESS_COOKIE_KEY");
    process.exit();
}
const accessTokenKey = process.env.ACCESS_COOKIE_KEY;
if (!process.env.REFRESH_COOKIE_KEY) {
    console.log("Missing REFRESH_COOKIE_KEY");
    process.exit();
}
const refreshTokenKey = process.env.REFRESH_COOKIE_KEY;
function googleAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.EXE_ENV === "DEV" && process.env.SKIP_LOGIN_AUTH === "TRUE") {
            let user = yield user_service_1.default.readByEmail(testEmail);
            if (!user) {
                user = yield user_service_1.default.create(testEmail, "");
            }
            const accessToken = yield auth_service_1.default.generateAccessToken(user.id);
            const refreshToken = yield auth_service_1.default.generateRefreshToken(user.id);
            res.cookie(accessTokenKey, accessToken, cookieConfig);
            res.cookie(refreshTokenKey, refreshToken, cookieConfig);
            res.status(200).json(user);
        }
        const authUrl = auth_service_1.default.getGoogleAuthURL();
        res.redirect(authUrl);
    });
}
exports.googleAuth = googleAuth;
function googleRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = req.query.code;
        try {
            const userInfo = yield auth_service_1.default.googleCallback(code);
            let user = yield user_service_1.default.readByEmail(userInfo.email);
            if (!user) {
                user = yield user_service_1.default.create(userInfo.email, userInfo.picture);
            }
            const accessToken = yield auth_service_1.default.generateAccessToken(user.id);
            const refreshToken = yield auth_service_1.default.generateRefreshToken(user.id);
            res.cookie(accessTokenKey, accessToken, cookieConfig);
            res.cookie(refreshTokenKey, refreshToken, cookieConfig);
            res.redirect(loginRedirectURL);
        }
        catch (error) {
            console.error("Google OAuth callback error:", error);
            res.status(500).json({ message: "Google Auth failed" });
        }
    });
}
exports.googleRedirect = googleRedirect;
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies[refreshTokenKey];
        if (token) {
            try {
                const decodedToken = auth_service_1.default.verifyRefreshToken(token);
                const tokenStore = yield auth_service_1.default.readRefreshToken(decodedToken.id);
                if (!tokenStore || tokenStore.revoked) {
                    console.log("Invalid refresh token");
                    res.status(500).send();
                }
                // sync delete, if failed dont continue
                yield auth_service_1.default.deleteRefreshToken(decodedToken.id);
                const accessToken = auth_service_1.default.generateAccessToken(decodedToken.userId);
                const refreshToken = yield auth_service_1.default.generateRefreshToken(decodedToken.userId);
                res.cookie(accessTokenKey, accessToken, cookieConfig);
                res.cookie(refreshTokenKey, refreshToken, cookieConfig);
                res
                    .status(200)
                    .json({ access_token: accessToken, refresh_token: refreshToken });
            }
            catch (err) {
                console.log("Token verification failed", err);
                res.status(401).send();
            }
        }
        else {
            res.status(401).send();
        }
    });
}
exports.refresh = refresh;
function checkAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies[accessTokenKey];
        if (token) {
            try {
                auth_service_1.default.verifyAccessToken(token).userId;
                res.status(200).send();
            }
            catch (err) {
                res.status(401).send();
            }
        }
        else {
            res.status(401).send();
        }
    });
}
exports.checkAuth = checkAuth;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies[refreshTokenKey];
        if (token) {
            try {
                const id = auth_service_1.default.verifyRefreshToken(token).tokenId;
                yield auth_service_1.default.deleteRefreshToken(id);
                res.clearCookie(accessTokenKey, cookieConfig);
                res.clearCookie(refreshTokenKey, cookieConfig);
                res.status(200).send();
            }
            catch (err) {
                res.status(401).send();
            }
        }
        else {
            res.status(400).send();
        }
    });
}
exports.logout = logout;
