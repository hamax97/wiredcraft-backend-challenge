"use strict";

const express = require("express");
const user = require("./users");

const app = express();
app.use(express.json());

app.use("/users", user);

module.exports = app;
