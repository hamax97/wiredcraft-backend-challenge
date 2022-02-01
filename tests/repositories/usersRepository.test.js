"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

let usersRepository = rewire("../../src/repositories/usersRepository");
const wiredcraftDB = require("../../src/shared/wiredcraftDB");

describe("usersRepository", () => {
  let user;

  beforeEach(() => {
    user = {
      name: "Jogi the Bear",
      dob: "1957-01-04",
      address: "Jellystone Park",
    };
  });

  afterEach(() => {
    usersRepository = rewire("../../src/repositories/usersRepository");
  });

  context("create", () => {
    it("should fail if wrong user input", async () => {
      await expect(usersRepository.create()).to.eventually.be.rejectedWith(
        "Invalid user"
      );

      await expect(
        usersRepository.create({ dob: user.dob, address: user.address })
      ).to.eventually.be.rejectedWith("Invalid user");

      await expect(
        usersRepository.create({ name: user.name, address: user.address })
      ).to.eventually.be.rejectedWith("Invalid user");

      await expect(
        usersRepository.create({ name: user.name, dob: user.dob })
      ).to.eventually.be.rejectedWith("Invalid user");
    });

    it("should call database creation function", async () => {
      const createStub = sinon
        .stub(wiredcraftDB, "create")
        .resolves("fake_user_id");

      const collection = usersRepository.__get__("collection");

      const userId = await usersRepository.create(user);

      expect(user).to.have.property("createdAt").to.be.instanceOf(Date);
      expect(createStub).to.have.been.calledOnce;
      expect(createStub).to.have.been.calledWith(collection, user);
      createStub.restore();
    });
  });
});
