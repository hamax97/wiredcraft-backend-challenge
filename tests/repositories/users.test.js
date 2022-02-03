"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

let usersRepository = rewire("../../src/repositories/users");
const wiredcraftDB = require("../../src/shared/wiredcraftDB");

describe("users repository", () => {
  let fakeUser, collectionName;

  beforeEach(() => {
    fakeUser = {
      _id: "fake_user_id",
      name: "Jogi the Bear",
      dob: "1957-01-04",
      address: "Jellystone Park",
    };

    collectionName = usersRepository.__get__("collection");
  });

  afterEach(() => {
    usersRepository = rewire("../../src/repositories/users");
  });

  context("create", () => {
    it("should fail if wrong user input", async () => {
      await expect(usersRepository.create()).to.eventually.be.rejectedWith(
        "Invalid user"
      );

      await expect(
        usersRepository.create({ dob: fakeUser.dob, address: fakeUser.address })
      ).to.eventually.be.rejectedWith("Invalid user");

      await expect(
        usersRepository.create({
          name: fakeUser.name,
          address: fakeUser.address,
        })
      ).to.eventually.be.rejectedWith("Invalid user");

      await expect(
        usersRepository.create({ name: fakeUser.name, dob: fakeUser.dob })
      ).to.eventually.be.rejectedWith("Invalid user");
    });

    it("should call database creation function", async () => {
      const createStub = sinon
        .stub(wiredcraftDB, "create")
        .resolves("fake_user_id");

      await usersRepository.create(fakeUser);

      expect(fakeUser).to.have.property("createdAt").to.be.instanceOf(Date);
      expect(createStub).to.have.been.calledOnce;
      expect(createStub).to.have.been.calledWith(collectionName, fakeUser);
      createStub.restore();
    });
  });

  context("get", () => {
    it("should fail if wrong userId", async () => {
      const errorMessage = "Invalid userId";
      await expect(usersRepository.get()).to.eventually.be.rejectedWith(
        errorMessage
      );

      await expect(usersRepository.get(1)).to.eventually.be.rejectedWith(
        errorMessage
      );
    });

    it("shoul call get database function", async () => {
      const getStub = sinon
        .stub(wiredcraftDB, "get")
        .resolves(fakeUser);

      const user = await usersRepository.get(fakeUser._id);

      expect(getStub).to.have.been.calledOnce;
      expect(getStub).to.have.been.calledWith(collectionName, fakeUser._id);

      expect(user).to.equal(fakeUser);
    });
  });
});
