"use strict";

const express = require("express");
const user = require("./user")

const port = process.env.PORT || 3000;

const app = express();
app.use("/user", user);

app.listen(port);
