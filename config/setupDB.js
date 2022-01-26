"use strict";

const mongodb = require("mongodb");

const host = process.env.MONGODB_HOST || "mongodb";
const port = process.env.MONGODB_PORT || "27017";
const username = process.env.MONGODB_USERNAME || "root";
const password = process.env.MONGODB_PASSWORD || "password";
const dbname = process.env.MONGODB_DBNAME || "wiredcraft";

const uri = `mongodb://${host}:${port}`;

const client = new mongodb.MongoClient(uri);

async function setUp() {
  try {
    await client.connect();
    const db = client.db(dbname);

    await db.command({ping: 1});
    db.collection("users");

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

setUp().catch(console.dir);
