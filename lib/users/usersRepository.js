"use strict";

const wiredcraftDB = require("../shared/wiredcraftDB");

const collection = "users";

exports.create = async (user) => {
  if (!user || !user.name || !user.dob || !user.address) {
    throw new Error("Invalid user");
  }

  user.createdAt = new Date();
  return await wiredcraftDB.create(collection, user);
};
