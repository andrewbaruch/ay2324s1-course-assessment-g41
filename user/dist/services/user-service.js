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
const user_1 = require("../models/user");
class UserService {
    create(email, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'INSERT INTO users (email, image) VALUES ($1, $2) RETURNING *;';
                const result = yield postgres_1.default.query(query, [
                    email,
                    image,
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
                const query = `
            SELECT *
            FROM users
            WHERE users.id = $1
        `;
                const userResult = yield postgres_1.default.query(query, [userId]);
                if (!userResult.rows || userResult.rows.length === 0) {
                    return null;
                }
                const dbUser = userResult.rows[0];
                const user = {
                    id: dbUser.id,
                    email: dbUser.email,
                    image: dbUser.image,
                    name: dbUser.name,
                    preferred_language: dbUser.preferred_language,
                    preferred_difficulty: dbUser.preferred_difficulty,
                    preferred_topics: [],
                };
                const topicsQuery = `
        SELECT topics.*
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;
                const topicsResult = yield postgres_1.default.query(topicsQuery, [userId]);
                if (topicsResult.rows) {
                    user.preferred_topics = topicsResult.rows;
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    readByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT users.*, languages.name AS preferred_language_name
        FROM users
        LEFT JOIN languages ON users.preferred_language = languages.id
        WHERE users.email = $1
      `;
                const userResult = yield postgres_1.default.query(query, [email]);
                if (!userResult.rows || userResult.rows.length === 0) {
                    return null;
                }
                const user = Object.assign(Object.assign({}, userResult.rows[0]), { preferred_language: userResult.rows[0].preferred_language_name, preferred_topics: [] });
                const topicsQuery = `
        SELECT topics.*
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;
                const topicsResult = yield postgres_1.default.query(topicsQuery, [user.id]);
                if (topicsResult.rows) {
                    user.preferred_topics = topicsResult.rows;
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    readMulti(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = [];
                for (const userId of userIds) {
                    const user = yield this.read(userId);
                    if (user) {
                        users.push(user);
                    }
                }
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(userId, fieldsToUpdate) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        UPDATE users
        SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          image = COALESCE($3, image),
          preferred_language = COALESCE($4, preferred_language),
          preferred_difficulty = COALESCE($5, preferred_difficulty)
        WHERE id = $6;
      `;
                let preferred_difficulty = null;
                if (fieldsToUpdate.preferred_difficulty && fieldsToUpdate.preferred_difficulty in user_1.Difficulty) {
                    preferred_difficulty = fieldsToUpdate.preferred_difficulty;
                }
                yield postgres_1.default.query(query, [
                    (_a = fieldsToUpdate.name) !== null && _a !== void 0 ? _a : null,
                    (_b = fieldsToUpdate.email) !== null && _b !== void 0 ? _b : null,
                    (_c = fieldsToUpdate.image) !== null && _c !== void 0 ? _c : null,
                    (_d = fieldsToUpdate.preferred_language) !== null && _d !== void 0 ? _d : null,
                    preferred_difficulty,
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
    readTopics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT topics.id, topics.name, topics.slug, topics.description
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;
                const result = yield postgres_1.default.query(query, [userId]);
                return result.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addTopics(userId, topicSlugs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const topicIds = yield this.getTopicIdsBySlugs(topicSlugs);
                if (topicIds.length > 0) {
                    const query = `
          INSERT INTO user_topic (user_id, topic_id)
          VALUES 
            ${topicIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
        `;
                    yield postgres_1.default.query(query, [userId, ...topicIds]);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateTopics(userId, topicIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let begunTransaction = false;
            try {
                yield postgres_1.default.query('BEGIN');
                begunTransaction = true;
                const deleteQuery = `
            DELETE FROM user_topic WHERE user_id = $1
        `;
                yield postgres_1.default.query(deleteQuery, [userId]);
                if (topicIds.length > 0) {
                    const insertQuery = `
                INSERT INTO user_topic (user_id, topic_id)
                VALUES 
                ${topicIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
            `;
                    yield postgres_1.default.query(insertQuery, [userId, ...topicIds]);
                }
                yield postgres_1.default.query('COMMIT');
            }
            catch (error) {
                if (begunTransaction) {
                    yield postgres_1.default.query('ROLLBACK');
                }
                throw error;
            }
        });
    }
    deleteTopics(userId, topicSlugs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const topicIds = yield this.getTopicIdsBySlugs(topicSlugs);
                if (topicIds.length > 0) {
                    const query = `
          DELETE FROM user_topic
          WHERE user_id = $1 AND topic_id IN (${topicIds.map((_, i) => `$${i + 2}`).join(', ')})
        `;
                    yield postgres_1.default.query(query, [userId, ...topicIds]);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTopicIdsBySlugs(slugs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT id
        FROM topics
        WHERE slug IN (${slugs.map((_, i) => `$${i + 1}`).join(', ')})
      `;
                const result = yield postgres_1.default.query(query, slugs);
                return result.rows.map((row) => row.id);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const userService = new UserService();
exports.default = userService;
