"use strict";

const mongodb = require("mongodb");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

const sandbox = sinon.createSandbox();
let wiredcraftDB = rewire("./wiredcraftDB");

describe("wiredcraftDB", () => {
  let initStub, collectionName, collectionStub, insertStub;

  beforeEach(() => {
    insertStub = sandbox
      .stub(mongodb.Collection.prototype, "insertOne")
      .resolves({insertedId: "fake_inserted_id"});

    collectionStub = sandbox
      .stub(mongodb.Db.prototype, "collection")
      .returns({ insertOne: insertStub });
    collectionName = "fake_collection";

    initStub = sandbox.stub().resolves({ collection: collectionStub });
    wiredcraftDB.__set__("init", initStub);
  });

  afterEach(() => {
    wiredcraftDB = rewire("./wiredcraftDB");
    sandbox.restore();
  });

  context("create", () => {
    it("should fail if wrong input", async () => {
      const errorMessage = "Must specify collection and doc";
      await expect(wiredcraftDB.create()).to.eventually.be.rejectedWith(
        errorMessage
      );

      await expect(
        wiredcraftDB.create(null, { some: "doc" })
      ).to.eventually.be.rejectedWith(errorMessage);

      await expect(
        wiredcraftDB.create("someCollection", null)
      ).to.eventually.be.rejectedWith(errorMessage);
    });

    it("should initialize database connection", async () => {
      await wiredcraftDB.create(collectionName, {});
      expect(initStub).to.have.been.calledOnce;
    });

    it("should insert document", async () => {
      const doc = {
        some: "doc",
      };
      const insertedId = await wiredcraftDB.create(collectionName, doc);

      expect(collectionStub).to.have.been.calledOnce;
      expect(collectionStub).to.have.been.calledWith(collectionName);
      expect(insertStub).to.have.been.calledOnce;
      expect(insertStub).to.have.been.calledWith(doc);
      expect(insertedId).to.equal("fake_inserted_id");
    });
  });
});
