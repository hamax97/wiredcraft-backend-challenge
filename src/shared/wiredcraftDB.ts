import { MongoClient, Db, ObjectId } from "mongodb";

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbname = process.env.MONGODB_DBNAME;

const uri = `mongodb://${username}:${password}@${host}:${port}`;

let client: MongoClient;
let db: Db;

async function getClient() {
  if (client) {
    return client;
  }

  client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function getCollection(collectionName: string) {
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

export async function create(collectionName: string, doc: object) {
  if (!collectionName || !doc) {
    throw new Error("Must specify collection and doc");
  }

  const collection = await getCollection(collectionName);
  const result = await collection.insertOne(doc);
  return result.insertedId;
};

export async function get(collectionName: string, docId: string) {
  if (!collectionName || !docId) {
    throw new Error("Must specify collection and docId");
  }

  const collection = await getCollection(collectionName);
  return collection.findOne({ _id: new ObjectId(docId) });
};

export async function update(collectionName: string, docId: string, doc: object) {
  if (!collectionName || !docId || !doc) {
    throw new Error("Must specify collection, docId and doc");
  }

  const collection = await getCollection(collectionName);
  const updateResult = await collection.updateOne(
    { _id: new ObjectId(docId) },
    { $set: doc }
  );

  return updateResult.modifiedCount;
};
