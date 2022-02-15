"use strict";

require('dotenv').config({path: `${__dirname}/../.env`});

import express = require("express");
import user = require("./routers/users");

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/users", user);

app.listen(port);
