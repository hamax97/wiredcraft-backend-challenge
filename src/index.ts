import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";

import usersRouter from "./routers/users.js";

import { getDB } from "./shared/wiredcraftDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: `${__dirname}/../.env` });

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_port = process.env.MONGODB_PORT;
const mongodb_username = process.env.MONGODB_USERNAME;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_dbname = process.env.MONGODB_DBNAME;
const app_port = process.env.APP_PORT;

const db = getDB(
  mongodb_username,
  mongodb_password,
  mongodb_host,
  mongodb_port,
  mongodb_dbname
);

const app = express();
app.use(express.json());

app.use("/users", usersRouter);

app.listen(app_port);
