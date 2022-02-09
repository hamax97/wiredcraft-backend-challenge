"use strict";

const wiredcraftDB = require("../shared/wiredcraftDB");

const collection = "users";

exports.create = async (user) => {
  if (!user || !user.name || !user.dob || !user.address) {
    throw new Error("Invalid user");
  }

  user.createdAt = new Date();
  return wiredcraftDB.create(collection, user);
};

exports.get = async (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }

  return wiredcraftDB.get(collection, userId);
};

exports.update = async (userId, newUser) => {
  if (!userId || !newUser) {
    throw new Error("Invalid input. Must provide userId and newUser");
  }

  if (Object.keys(newUser).length === 0) {
    throw new Error("newUser empty");
  }

  return wiredcraftDB.update(collection, userId, newUser);
};
