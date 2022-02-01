"use strict";

require('dotenv').config({path: `${__dirname}/../.env`});

const express = require("express");
const user = require("./routers/users");

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/users", user);

app.listen(port);
