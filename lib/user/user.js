"use strict";

const express = require("express");

const router = express.Router();
module.exports = router;

router.post("/", (req, res) => {
  console.log("Implement create operation!");
  res.send("Implement create operation!");
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
