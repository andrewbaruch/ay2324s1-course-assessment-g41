import "dotenv/config";
import Server from "@/server";

const matchingServer = new Server();
matchingServer.start();

// import { Request, Response } from "express";

// const express = require("express");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
// app.get("/shenme", (req: Request, res: Response) => {
//   res.send("shemegui Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
