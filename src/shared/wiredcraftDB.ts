import { Db, MongoClient, ObjectId } from "mongodb";

// TODOs: Implement singleton pattern
// - https://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-a-singleton-in-javascript
// - Get instance at index.js right after the process.env has loaded.
// - Pass the instance to the usersRepository.

// Perhaps a function that returns a class that returns always the same ref in the constructor().

class WiredcraftDB implements IWiredcraftDB {
  private _uri: string;
  private _client: MongoClient = {} as any;
  private _db: Db = {} as any;

  constructor(
    username: string,
    password: string,
    host: string,
    port: number,
    database: string
  ) {
    this._uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }

  private async _getCollection(collectionName: string) {
    if (!this._client) {
      try {
        this._client = new MongoClient(this._uri);
        await this._client.connect();
        this._db = this._client.db();
      } catch (err) {
        throw new Error(`Couldn't connect to database. Error: ${err}`);
      }
    }

    return this._db.collection(collectionName);
  }

  async create(collectionName: string, doc: object) {
    if (!collectionName || !doc) {
      throw new Error("Must specify collection and doc");
    }
    const collection = await this._getCollection(collectionName);
    const result = await collection.insertOne(doc);
    return result.insertedId.toString();
  }

  async get(collectionName: string, docId: string) {
    if (!collectionName || !docId) {
      throw new Error("Must specify collection and docId");
    }

    const collection = await this._getCollection(collectionName);
    const foundDoc = await collection.findOne({ _id: new ObjectId(docId) });
    if (!foundDoc) {
      return null;
    }

    return foundDoc as object;
  }

  async update(collectionName: string, docId: string, doc: object) {
    if (!collectionName || !docId || !doc) {
      throw new Error("Must specify collection, docId and doc");
    }

    const collection = await this._getCollection(collectionName);
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(docId) },
      { $set: doc }
    );

    return updateResult.modifiedCount;
  }
}

let dbInstance: IWiredcraftDB;

export function getDB(
  username: string,
  password: string,
  host: string,
  port: number,
  database: string
): IWiredcraftDB {
  if (!dbInstance) {
    dbInstance = new WiredcraftDB(username, password, host, port, database);
  }

  return dbInstance;
}
