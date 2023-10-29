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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postgres_1 = __importDefault(require("../clients/postgres"));
const googleapis_1 = require("googleapis");
class AuthService {
    constructor() {
        this.googleClient = new googleapis_1.google.auth.OAuth2(process.env.OAUTH_GOOGLE_CLIENT, process.env.OAUTH_GOOGLE_SECRET, process.env.AUTH_DOMAIN + "/auth/googleRedirect");
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.log("Missing JWT_SECRET");
            process.exit();
        }
        this.jwtSecret = secret;
    }
    generateAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.jwtSecret, { expiresIn: "1h" });
    }
    generateRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTimestampSeconds = Math.floor(Date.now() / 1000);
            const thirtyDaysSeconds = 30 * 24 * 60 * 60;
            const thirtyDaysTimestamp = currentTimestampSeconds + thirtyDaysSeconds;
            const token = yield authService.createRefreshToken(userId, thirtyDaysTimestamp);
            return jsonwebtoken_1.default.sign({ userId, tokenId: token.id }, this.jwtSecret, {
                expiresIn: "30d",
            });
        });
    }
    verifyAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
        return decoded;
    }
    verifyRefreshToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
        return decoded;
    }
    getGoogleAuthURL() {
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ];
        return this.googleClient.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: scopes,
        });
    }
    googleCallback(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenResp = yield this.googleClient.getToken(code);
                yield this.googleClient.setCredentials(tokenResp.tokens);
                const credentials = this.googleClient.credentials;
                const accessToken = credentials.access_token;
                const res = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
                const data = yield res.json();
                console.log(data);
                return data;
            }
            catch (err) {
                console.log("Google callback failed");
            }
        });
    }
    createRefreshToken(user_id, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO refresh_tokens (user_id, revoked, expiry)
                VALUES ($1, FALSE, to_timestamp($2))
                RETURNING *;
            `;
                const result = yield postgres_1.default.query(query, [
                    user_id,
                    expiry,
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    readRefreshToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "SELECT * FROM refresh_tokens WHERE id = $1";
                const result = yield postgres_1.default.query(query, [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRefreshToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "DELETE FROM refresh_tokens WHERE id = $1";
                yield postgres_1.default.query(query, [id]);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
const authService = new AuthService();
exports.default = authService;
