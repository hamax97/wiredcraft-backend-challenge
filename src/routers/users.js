"use strict";

const express = require("express");

const usersRepository = require("../repositories/users");
const utils = require("../shared/utils");

const router = express.Router();

module.exports = router;

router.post("/", async (req, res) => {
  try {
    const userId = await usersRepository.create(req.body);
    res.status(201).json({ userId: userId });
  } catch (err) {
    utils.handleError(err, res);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await usersRepository.get(userId);

    if (!user) {
      res.status(404).json({ error: `User ${userId} not found` });
    } else {
      res.status(200).json(user);
    }

  } catch (err) {
    utils.handleError(err, res);
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const newUser = req.body;

    const updatedCount = await usersRepository.update(userId, newUser);

    if (updatedCount > 0) {
      res.status(200);
    } else {
      res.status(500);
    }

    res.json({updatedCount: updatedCount});
  } catch (err) {
    utils.handleError(err, res);
  }
});

router.delete("/:id", (req, res) => {
  console.log("Implement delete operation!");
  res.send("Implement delete operation!");
});
