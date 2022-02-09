"use strict";

const { MongoClient, ObjectId } = require("mongodb");

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbname = process.env.MONGODB_DBNAME;

const uri = `mongodb://${username}:${password}@${host}:${port}`;

let client;
let db;

async function getClient() {
  if (client) {
    return client;
  }

  client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function getCollection(collectionName) {
  if (!db) {
    try {
      client = await getClient();
      db = client.db(dbname);
    } catch (err) {
      console.error(`Error connecting to database: ${err}`);
      throw err;
    }
  }

  return db.collection(collectionName);
}

exports.create = async (collectionName, doc) => {
  if (!collectionName || !doc) {
    throw new Error("Must specify collection and doc");
  }

  const collection = await getCollection(collectionName);
  const result = await collection.insertOne(doc);
  return result.insertedId;
};

exports.get = async (collectionName, docId) => {
  if (!collectionName || !docId) {
    throw new Error("Must specify collection and docId");
  }

  const collection = await getCollection(collectionName);
  return collection.findOne({ _id: ObjectId(docId) });
};

exports.update = async (collectionName, docId, doc) => {
  if (!collectionName || !docId || !doc) {
    throw new Error("Must specify collection, docId and doc");
  }

  const collection = await getCollection(collectionName);
  const updateResult = await collection.updateOne(
    { _id: ObjectId(docId) },
    { $set: doc }
  );

  return updateResult.modifiedCount;
};
