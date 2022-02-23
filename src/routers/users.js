import { Router } from "express";

import * as UsersRepository from "../repositories/users.js";
import * as Utils from "../shared/utils.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const userId = await UsersRepository.create(req.body);
    res.status(201).json({ userId: userId });
  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UsersRepository.get(userId);

    if (!user) {
      res.status(404).json({ error: `User ${userId} not found` });
    } else {
      res.status(200).json(user);
    }

  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const newUser = req.body;

    const updatedCount = await UsersRepository.update(userId, newUser);

    if (updatedCount > 0) {
      res.status(200);
    } else {
      res.status(500);
    }

    res.json({ updatedCount: updatedCount });
  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.delete("/:id", (_, res) => {
  console.log("Implement delete operation!");
  res.send("Implement delete operation!");
});

export default router;
