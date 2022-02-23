import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

import express from "express";
import usersRouter from "./routers/users.js";

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/users", usersRouter);

app.listen(port);
