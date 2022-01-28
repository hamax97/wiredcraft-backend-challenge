const { MongoClient } = require("mongodb");

const host = process.env.MONGODB_HOST || "localhost";
const port = process.env.MONGODB_PORT || "27017";
const username = process.env.MONGODB_USERNAME || "root";
const password = process.env.MONGODB_PASSWORD || "password";
const dbname = process.env.MONGODB_DBNAME || "wiredcraft";

const uri = `mongodb://${username}:${password}@${host}:${port}`;

const client = new MongoClient(uri);
let db;

async function init() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbname);
      return db;
    } catch (err) {
      console.error(`Error connecting to database: ${err}`);
      throw err;
    }
  }
}

exports.create = async (collection, doc) => {
  if (!collection || !doc) {
    throw new Error("Must specify collection and doc");
  }

  const db = await init();
  const result = await db.collection(collection).insertOne(doc);
  return result.insertedId;
}

