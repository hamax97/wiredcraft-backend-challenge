import * as WiredcraftDB from "../../src/shared/wiredcraftDB";


jest.mock("mongodb"); // hoisted to the top of the file.

let fakeCollectionName: string, fakeDoc: object, fakeDocId: string;
let collectionMock: jest.Mock,
  insertMock: jest.Mock,
  findMock: jest.Mock,
  updateMock: jest.Mock;

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

  collectionMock = jest.fn().mockReturnValue({
    insertOne: insertMock,
    findOne: findMock,
    updateOne: updateMock,
  });

  // WiredcraftDB.__set__("getCollection", getCollectionMock);
});

afterEach(() => {
  insertMock.mockReset();
  findMock.mockReset();
  updateMock.mockReset();
  collectionMock.mockReset();
});

describe("create", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Must specify collection and doc");

    await expect(WiredcraftDB.create(null as any, null as any)).rejects.toThrowError(error);
    await expect(
      WiredcraftDB.create(fakeCollectionName, null as any)
    ).rejects.toThrowError(error);
    await expect(WiredcraftDB.create(null as any, fakeDoc)).rejects.toThrowError(
      error
    );
  });

  // test("initializes db collection", async () => {
  //   await WiredcraftDB.create(fakeCollectionName, fakeDoc);
  //   expect(getCollectionMock).toHaveBeenCalledTimes(1);
  //   expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
  // });

  // test("inserts document to db", async () => {
  //   const insertedId = await WiredcraftDB.create(fakeCollectionName, fakeDoc);

  //   expect(insertMock).toHaveBeenCalledTimes(1);
  //   expect(insertMock).toHaveBeenCalledWith(fakeDoc);
  //   expect(insertedId).toBe(fakeDocId);
  // });
});

// describe("get", () => {
//   test("throws if wrong input", async () => {
//     const error = new Error("Must specify collection and docId");

//     await expect(WiredcraftDB.get()).rejects.toThrowError(error);
//     await expect(
//       WiredcraftDB.get(fakeCollectionName, null)
//     ).rejects.toThrowError(error);
//     await expect(WiredcraftDB.get(null, fakeDocId)).rejects.toThrowError(error);
//   });

//   test("initializes db collection", async () => {
//     await WiredcraftDB.create(fakeCollectionName, fakeDoc);
//     expect(getCollectionMock).toHaveBeenCalledTimes(1);
//     expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
//   });

//   test("returns document from db", async () => {
//     const doc = await WiredcraftDB.get(fakeCollectionName, fakeDocId);
//     expect(findMock).toHaveBeenCalledTimes(1);

//     const idArg = findMock.mock.calls[0][0];
//     expect(idArg).toHaveProperty("_id");
//     expect(idArg._id.equals(fakeDocId)).toBe(true);

//     expect(doc).toHaveProperty("_id");
//   });
// });

// describe("update", () => {
//   test("throws if wrong input", async () => {
//     const error = new Error("Must specify collection, docId and doc");

//     await expect(WiredcraftDB.update()).rejects.toThrowError(error);
//     await expect(WiredcraftDB.update(fakeCollectionName)).rejects.toThrowError(
//       error
//     );
//     await expect(
//       WiredcraftDB.update(fakeCollectionName, fakeDocId)
//     ).rejects.toThrowError(error);
//     await expect(
//       WiredcraftDB.update(null, fakeDocId, fakeDoc)
//     ).rejects.toThrowError(error);
//   });

//   test("initializes db collection", async () => {
//     await WiredcraftDB.create(fakeCollectionName, fakeDoc);
//     expect(getCollectionMock).toHaveBeenCalledTimes(1);
//     expect(getCollectionMock).toHaveBeenCalledWith(fakeCollectionName);
//   });

//   test("updates document", async () => {
//     const modifiedCount = await WiredcraftDB.update(fakeCollectionName, fakeDocId, fakeDoc);

//     expect(updateMock).toHaveBeenCalledTimes(1);

//     const idArg = updateMock.mock.calls[0][0];
//     expect(idArg).toHaveProperty("_id");
//     expect(idArg._id.equals(fakeDocId)).toBe(true);

//     const operatorArg = updateMock.mock.calls[0][1];
//     expect(operatorArg).toHaveProperty("$set");
//     expect(operatorArg.$set).toStrictEqual(fakeDoc);

//     expect(modifiedCount).toEqual(1);
//   });
// });
