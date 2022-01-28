"use strict";

const express = require("express");

const usersRepository = require("./usersRepository");
const utils = require("../shared/utils");

const router = express.Router();

module.exports = router;

router.post("/", (req, res) => {
  usersRepository
    .create(req.body)
    .then((userId) => {
      res.writeHead(201, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ userId: userId }));
    })
    .catch((err) => {
      utils.handleError(err, res);
    });
});

router.get("/:id", (req, res) => {
  console.log("Implement read operation!");
  res.send("Implement read operation!");
});

router.post("/:id", (req, res) => {
  console.log("Implement update operation!");
  res.send("Implement update operation!");
});

router.delete("/:id", (req, res) => {
  console.log("Implement delete operation!");
  res.send("Implement delete operation!");
});
