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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class MongoDBClient {
    constructor() {
        var _a;
        this.collections = {};
        const connectionOptions = { maxPoolSize: 10 };
        this.client = new mongodb_1.MongoClient((_a = process.env.MONGO) !== null && _a !== void 0 ? _a : "mongodb://user:pass@mongodb", connectionOptions);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                this.db = this.client.db(process.env.MONGO_DBNAME);
            }
            catch (error) {
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
    getCollection(collectionName) {
        if (!this.db) {
            throw new Error('Database connection not established');
        }
        if (!this.collections[collectionName]) {
            this.collections[collectionName] = this.db.collection(collectionName);
        }
        return this.collections[collectionName];
    }
    findOne(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.getCollection(collectionName);
            return collection.findOne(filter);
        });
    }
    find(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Native sort 
            const collection = this.getCollection(collectionName);
            return collection.find(filter).toArray();
        });
    }
    insertOne(collectionName, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.getCollection(collectionName);
            return collection.insertOne(document);
        });
    }
    updateOne(collectionName, filter, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.getCollection(collectionName);
            const result = yield collection.updateOne(filter, { $set: update });
            if (result.modifiedCount === 0)
                return null;
            return this.findOne(collectionName, filter);
        });
    }
    deleteOne(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.getCollection(collectionName);
            return collection.deleteOne(filter);
        });
    }
}
exports.default = MongoDBClient;
