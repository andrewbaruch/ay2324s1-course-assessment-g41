"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const server_1 = __importDefault(require("./server"));
const matchingServer = new server_1.default();
matchingServer.start();
// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = express();
// const port = process.env.PORT;
// app.get('/', (req, res) => {
//   res.send('Express + TypeScript Server');
// });
// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
