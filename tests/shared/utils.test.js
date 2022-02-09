"use strict";

const utils = require("../../src/shared/utils");

describe("handleError", () => {
  let fakeRes, statusMock, jsonMock;
  beforeEach(() => {
    statusMock = jest.fn();
    jsonMock = jest.fn();
    statusMock.mockReturnValue({
      json: jsonMock,
    });

    fakeRes = {
      status: statusMock,
    };
  });

  afterEach(() => {
    statusMock.mockReset();
    jsonMock.mockReset();
  });

  test("calls res.status with 400", () => {
    utils.handleError(new Error("fake_error"), fakeRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(statusMock).toHaveBeenCalledTimes(1);
    statusMock.mockClear();

    utils.handleError("fake_error", fakeRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(statusMock).toHaveBeenCalledTimes(1);
  });

  test("checks for type of error and responds accordingly", () => {
    utils.handleError(new Error("fake_error"), fakeRes);
    expect(jsonMock).toHaveBeenCalledWith({ error: "fake_error" });
    expect(jsonMock).toHaveBeenCalledTimes(1);
    jsonMock.mockClear();

    utils.handleError("fake_error", fakeRes);
    expect(jsonMock).toHaveBeenCalledWith("fake_error");
    expect(jsonMock).toHaveBeenCalledTimes(1);
  });
});
