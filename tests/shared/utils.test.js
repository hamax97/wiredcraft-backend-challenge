"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const utils = require("../../src/shared/utils");
const sandbox = sinon.createSandbox();

describe("utils", () => {
  context("handleError", () => {
    let statusStub, jsonStub, res;

    beforeEach(() => {
      jsonStub = sandbox.stub();

      statusStub = sandbox.stub().returns({
        json: jsonStub,
      });

      res = {
        status: statusStub,
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should call res.status with 400", () => {
      utils.handleError(new Error("fake_error"), res);
      expect(statusStub).to.have.been.calledWith(400);
      expect(statusStub).to.have.been.calledOnce;

      utils.handleError("fake_error", res);
      expect(statusStub).to.have.been.calledWith(400);
      expect(statusStub).to.have.been.calledTwice;
    });

    it("should check for instanceof Error and respond accordingly", () => {
      utils.handleError(new Error("fake_error"), res);
      expect(jsonStub).to.have.been.calledWith({ error: "fake_error" });
      expect(jsonStub).to.have.been.calledOnce;

      utils.handleError("fake_error", res);
      expect(jsonStub).to.have.been.calledWith("fake_error");
      expect(jsonStub).to.have.been.calledTwice;
    });
  });
});
