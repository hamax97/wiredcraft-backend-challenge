"use strict";

const wiredcraftDB = require("../shared/wiredcraftDB");

const collectionName = "users";

exports.create = async (user) => {
  if (!user || !user.name || !user.dob || !user.address) {
    throw new Error("Invalid user");
  }

  user.createdAt = new Date();
  return wiredcraftDB.create(collectionName, user);
};

exports.get = async (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }

  return wiredcraftDB.get(collectionName, userId);
};

exports.update = async (userId, newUser) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }

  if (!newUser || Object.keys(newUser).length === 0) {
    throw new Error("Invalid newUser");
  }

  return wiredcraftDB.update(collectionName, userId, newUser);
};
