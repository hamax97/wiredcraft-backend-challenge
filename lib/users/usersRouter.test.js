"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const request = require("supertest");

const app = require("../index");

const usersRepository = require("./usersRepository");
const utils = require("../shared/utils");

describe("/users router", () => {
  let user;
  beforeEach(() => {
    user = {
      name: "Jogi the Bear",
      dob: "1957-01-04",
      address: "Jellystone Park",
    };
  });

  context("POST /users/", () => {
    let createStub, errorStub;

    it("should create user in database", (done) => {
      createStub = sinon
        .stub(usersRepository, "create")
        .resolves("fake_user_id");

      request(app)
        .post("/users/")
        .set("Accept", "application/json")
        .send(user)
        .expect(201)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(createStub).to.have.been.calledWith(user);
          expect(res.body).to.have.property("userId").to.equal("fake_user_id");

          createStub.restore();
          done(err);
        });
    });

    it("should call handleError on invalid user", (done) => {
      createStub = sinon
        .stub(usersRepository, "create")
        .rejects(new Error("fake_user_creation_error"));

      errorStub = sinon.stub(utils, "handleError").callsFake((err, res) => {
        return res.status(400).json({ error: err.message });
      });

      const invalidUser = { name: "Fake Name" };

      request(app)
        .post("/users/")
        .set("Accept", "application/json")
        .send(invalidUser)
        .expect(400)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(createStub).to.have.been.calledWithMatch(invalidUser);
          expect(errorStub).to.have.been.calledOnce;
          expect(res.body)
            .to.have.property("error")
            .to.equal("fake_user_creation_error");

          createStub.restore();
          errorStub.restore();
          done(err);
        });
    });
  });
});
