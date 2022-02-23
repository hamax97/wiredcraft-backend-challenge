import * as WiredcraftDB from "../shared/wiredcraftDB.js";

const collectionName = "users";

export async function create(user) {
  if (!user || !user.name || !user.dob || !user.address) {
    throw new Error("Invalid user");
  }

  user.createdAt = new Date();
  return WiredcraftDB.create(collectionName, user);
};

export async function get(userId) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }

  return WiredcraftDB.get(collectionName, userId);
};

export async function update(userId, newUser) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }

  if (!newUser || Object.keys(newUser).length === 0) {
    throw new Error("Invalid newUser");
  }

  return WiredcraftDB.update(collectionName, userId, newUser);
};
