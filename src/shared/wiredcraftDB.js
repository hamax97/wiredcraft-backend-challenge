"use strict";

const { MongoClient } = require("mongodb");

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

async function getDB() {
  if (!db) {
    try {
      client = await getClient();
      db = client.db(dbname);
      return db;
    } catch (err) {
      console.error(`Error connecting to database: ${err}`);
      throw err;
    }
  }

  return db;
}

exports.create = async (collection, doc) => {
  if (!collection || !doc) {
    throw new Error("Must specify collection and doc");
  }

  const db = await getDB();
  const result = await db.collection(collection).insertOne(doc);
  return result.insertedId;
}

