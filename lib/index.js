"use strict";

const express = require("express");
const user = require("./users");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/users", user);

app.listen(port);
