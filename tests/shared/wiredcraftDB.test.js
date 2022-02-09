"use strict";

const { ObjectId } = require("mongodb");
const rewire = require("rewire");

const wiredcraftDBModulePath = "../../src/shared/wiredcraftDB";
let wiredcraftDB = rewire(wiredcraftDBModulePath);

let fakeCollectionName, fakeDoc, fakeDocId;
let getCollectionMock, insertMock, findMock, updateMock;

beforeEach(() => {
  fakeCollectionName = "fake_collection";
  fakeDoc = {
    name: "Some Fake Name",
    address: "With Some Fake Address, NY",
  };
  fakeDocId = "f".repeat(12);

  insertMock = jest.fn().mockResolvedValue({ insertedId: fakeDocId });
  findMock = jest.fn().mockResolvedValue({ _id: fakeDocId });
  updateMock = jest.fn().mockResolvedValue({ modifiedCount: 1 });

  getCollectionMock = jest.fn().mockReturnValue({
    insertOne: insertMock,
    findOne: findMock,
    updateOne: updateMock,
  });

  wiredcraftDB.__set__("getCollection", getCollectionMock);
});

afterEach(() => {
  insertMock.mockReset();
  findMock.mockReset();
  updateMock.mockReset();
  getCollectionMock.mockReset();
});

describe("create", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Must specify collection and doc");

    await expect(wiredcraftDB.create()).rejects.toThrowError(error);
    await expect(wiredcraftDB.create(fakeCollectionName)).rejects.toThrowError(
      error
    );
    await expect(wiredcraftDB.create(null, fakeDoc)).rejects.toThrowError(
      error
    );
  });

  test("initializes db collection", async () => {
    await wiredcraftDB.create(fakeCollectionName, fakeDoc);
    expect(getCollectionMock).toHaveBeenCalledTimes(1);
    expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
  });

  test("inserts document to db", async () => {
    const insertedId = await wiredcraftDB.create(fakeCollectionName, fakeDoc);

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith(fakeDoc);
    expect(insertedId).toBe(fakeDocId);
  });
});

describe("get", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Must specify collection and docId");

    await expect(wiredcraftDB.get()).rejects.toThrowError(error);
    await expect(
      wiredcraftDB.get(fakeCollectionName, null)
    ).rejects.toThrowError(error);
    await expect(wiredcraftDB.get(null, fakeDocId)).rejects.toThrowError(error);
  });

  test("initializes db collection", async () => {
    await wiredcraftDB.create(fakeCollectionName, fakeDoc);
    expect(getCollectionMock).toHaveBeenCalledTimes(1);
    expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
  });

  test("returns document from db", async () => {
    const doc = await wiredcraftDB.get(fakeCollectionName, fakeDocId);
    expect(findMock).toHaveBeenCalledTimes(1);

    const idArg = findMock.mock.calls[0][0];
    expect(idArg).toHaveProperty("_id");
    expect(idArg._id.equals(fakeDocId)).toBe(true);

    expect(doc).toHaveProperty("_id");
  });
});

describe("update", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Must specify collection, docId and doc");

    await expect(wiredcraftDB.update()).rejects.toThrowError(error);
    await expect(wiredcraftDB.update(fakeCollectionName)).rejects.toThrowError(
      error
    );
    await expect(
      wiredcraftDB.update(fakeCollectionName, fakeDocId)
    ).rejects.toThrowError(error);
    await expect(
      wiredcraftDB.update(null, fakeDocId, fakeDoc)
    ).rejects.toThrowError(error);
  });

  test("initializes db collection", async () => {
    await wiredcraftDB.create(fakeCollectionName, fakeDoc);
    expect(getCollectionMock).toHaveBeenCalledTimes(1);
    expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
  });

  test("updates document", async () => {
    const modifiedCount = await wiredcraftDB.update(fakeCollectionName, fakeDocId, fakeDoc);

    expect(updateMock).toHaveBeenCalledTimes(1);

    const idArg = updateMock.mock.calls[0][0];
    expect(idArg).toHaveProperty("_id");
    expect(idArg._id.equals(fakeDocId)).toBe(true);

    const operatorArg = updateMock.mock.calls[0][1];
    expect(operatorArg).toHaveProperty("$set");
    expect(operatorArg.$set).toEqual(fakeDoc);

    expect(modifiedCount).toEqual(1);
  });
});
