"use strict";

const { Collection, ObjectId } = require("mongodb");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

const sandbox = sinon.createSandbox();
let wiredcraftDB = rewire("../../src/shared/wiredcraftDB");

describe("wiredcraftDB", () => {
  let fakeCollectionName,
    fakeDocId,
    fakeDoc,
    getCollectionStub,
    insertStub,
    findStub,
    updateStub;

  beforeEach(() => {
    fakeCollectionName = "fake_collection";
    fakeDocId = "f".repeat(12);
    fakeDoc = {
      name: "Some Fake Name",
      address: "With Some Fake Address, NY",
    };

    insertStub = sandbox
      .stub(Collection.prototype, "insertOne")
      .resolves({ insertedId: fakeDocId });

    findStub = sandbox
      .stub(Collection.prototype, "findOne")
      .withArgs({ _id: ObjectId(fakeDocId) })
      .resolves({ _id: fakeDocId });

    updateStub = sandbox.stub(Collection.prototype, "updateOne").resolves({
      modifiedCount: 1,
    });

    getCollectionStub = sandbox.stub().resolves({
      insertOne: insertStub,
      findOne: findStub,
      updateOne: updateStub,
    });

    wiredcraftDB.__set__("getCollection", getCollectionStub);
  });

  afterEach(() => {
    wiredcraftDB = rewire("../../src/shared/wiredcraftDB");
    sandbox.restore();
  });

  context("create", () => {
    it("should fail if wrong input", async () => {
      // const error = new Error("Must specify collection and doc");
      const error = "Must specify collection and doc";
      await expect(wiredcraftDB.create()).to.eventually.be.rejectedWith(
        "a"
      );

      await expect(
        wiredcraftDB.create(null, { some: "doc" })
      ).to.eventually.be.rejectedWith(error);

      await expect(
        wiredcraftDB.create("someCollection", null)
      ).to.eventually.be.rejectedWith(error);
    });

    it("should initialize database connection", async () => {
      await wiredcraftDB.create(fakeCollectionName, {});
      expect(getCollectionStub).to.have.been.calledOnce;
      expect(getCollectionStub).to.have.been.calledWith(fakeCollectionName);
    });

    it("should insert document", async () => {
      const doc = {
        some: "doc",
      };
      const insertedId = await wiredcraftDB.create(fakeCollectionName, doc);

      expect(insertStub).to.have.been.calledOnce;
      expect(insertStub).to.have.been.calledWith(doc);
      expect(insertedId).to.equal(fakeDocId);
    });
  });

  context("get", () => {
    it("should fail if wrong input", async () => {
      const errorMessage = "Must specify collection and docId";
      await expect(wiredcraftDB.get()).to.eventually.be.rejectedWith(
        errorMessage
      );

      await expect(
        wiredcraftDB.get(null, fakeDocId)
      ).to.eventually.be.rejectedWith(errorMessage);

      await expect(
        wiredcraftDB.get(fakeCollectionName)
      ).to.eventually.be.rejectedWith(errorMessage);
    });

    it("should initialize database connection", async () => {
      await wiredcraftDB.get(fakeCollectionName, fakeDocId);
      expect(getCollectionStub).to.have.been.calledOnce;
      expect(getCollectionStub).to.have.been.calledWith(fakeCollectionName);
    });

    it("should get document", async () => {
      const doc = await wiredcraftDB.get(fakeCollectionName, fakeDocId);

      expect(doc).to.have.property("_id").to.equal(fakeDocId);
    });
  });

  context("update", () => {
    it("should fail if wrong input", async () => {
      const errorMessage = "Must specify collection, docId and doc";
      await expect(wiredcraftDB.update()).to.eventually.be.rejectedWith(
        errorMessage
      );

      await expect(
        wiredcraftDB.update(fakeCollectionName)
      ).to.eventually.be.rejectedWith(errorMessage);

      await expect(
        wiredcraftDB.update(fakeCollectionName, fakeDocId)
      ).to.eventually.be.rejectedWith(errorMessage);
    });

    it("should initialize database connection", async () => {
      await wiredcraftDB.update(fakeCollectionName, fakeDocId, fakeDoc);
      expect(getCollectionStub).to.have.been.calledOnce;
      expect(getCollectionStub).to.have.been.calledWith(fakeCollectionName);
    });

    it("should update document", async () => {
      const modifiedCount = await wiredcraftDB.update(
        fakeCollectionName,
        fakeDocId,
        fakeDoc
      );

      expect(updateStub).to.have.been.calledOnce;
      expect(updateStub).to.have.been.calledWith(
        { _id: ObjectId(fakeDocId) },
        {
          $set: fakeDoc,
        }
      );
      expect(modifiedCount).to.equal(1);
    });
  });
});
