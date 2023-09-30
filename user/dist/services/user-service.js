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
const postgres_1 = __importDefault(require("../clients/postgres"));
class UserService {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'INSERT INTO users (id, name, email, image) VALUES ($1, $2, $3, $4)';
                const result = yield postgres_1.default.query(query, [
                    user.id,
                    user.name,
                    user.email,
                    user.image,
                ]);
                if (!result.rows) {
                    throw Error;
                }
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    read(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM users WHERE id = $1';
                const result = yield postgres_1.default.query(query, [userId]);
                if (!result.rows) {
                    throw Error;
                }
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    readMulti(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM users WHERE id IN (${userIds.map((_, i) => `$${i + 1}`).join(', ')})`;
                const result = yield postgres_1.default.query(query, userIds);
                return result.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    readAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM users';
                const result = yield postgres_1.default.query(query);
                return result.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(userId, updatedUser) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 
                // 'UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4';
                'UPDATE users SET \
          name = COALESCE($1, name), \
          email = COALESCE($2, email), \
          image = COALESCE($3, image), \
        WHERE id = $4';
                yield postgres_1.default.query(query, [
                    (_a = updatedUser.name) !== null && _a !== void 0 ? _a : null,
                    (_b = updatedUser.email) !== null && _b !== void 0 ? _b : null,
                    (_c = updatedUser.image) !== null && _c !== void 0 ? _c : null,
                    userId,
                ]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM users WHERE id = $1';
                yield postgres_1.default.query(query, [userId]);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const userService = new UserService();
exports.default = userService;
