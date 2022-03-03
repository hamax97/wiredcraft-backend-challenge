import * as WiredcraftDBMock from "../../src/shared/wiredcraftDB.js";
import * as UsersRepository from "../../src/repositories/users.js";

jest.mock("../../src/shared/wiredcraftDB.js", () => ({
  create: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
}));

let collectionName, fakeUser;

beforeEach(() => {
  collectionName = "users";
  fakeUser = {
    _id: "fake_user_id",
    name: "Jogi the Bear",
    dob: "1957-01-04",
    address: "Jellystone Park",
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("create", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Invalid user");
    await expect(UsersRepository.create()).rejects.toThrowError(error);

    await expect(
      UsersRepository.create({ dob: fakeUser.dob, address: fakeUser.address })
    ).rejects.toThrowError(error);

    await expect(
      UsersRepository.create({
        name: fakeUser.name,
        address: fakeUser.address,
      })
    ).rejects.toThrowError(error);

    await expect(
      UsersRepository.create({ name: fakeUser.name, dob: fakeUser.dob })
    ).rejects.toThrowError(error);
  });

  test("adds createdAt property to given user", async () => {
    await UsersRepository.create(fakeUser);

    expect(fakeUser).toHaveProperty("createdAt");
    expect(fakeUser.createdAt).toBeInstanceOf(Date);
  });

  test("calls database creation function", async () => {
    await UsersRepository.create(fakeUser);
    expect(WiredcraftDBMock.create).toHaveBeenCalledTimes(1);
    expect(WiredcraftDBMock.create).toHaveBeenCalledWith(
      collectionName,
      fakeUser
    );
  });
});

describe("get", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Invalid userId");

    await expect(UsersRepository.get()).rejects.toThrowError(error);
    await expect(UsersRepository.get(123)).rejects.toThrowError(error);
  });

  test("call get from database function", async () => {
    await UsersRepository.get(fakeUser._id);

    expect(WiredcraftDBMock.get).toHaveBeenCalledTimes(1);
    expect(WiredcraftDBMock.get).toHaveBeenCalledWith(
      collectionName,
      fakeUser._id
    );
  });
});

describe("update", () => {
  test("throws if wrong input", async () => {
    const error1 = new Error("Invalid userId");

    await expect(UsersRepository.update()).rejects.toThrowError(error1);
    await expect(UsersRepository.update(123)).rejects.toThrowError(error1);

    const error2 = new Error("Invalid newUser");
    await expect(UsersRepository.update(fakeUser._id)).rejects.toThrowError(
      error2
    );
    await expect(UsersRepository.update(fakeUser._id, {})).rejects.toThrowError(
      error2
    );
  });

  test("calls database update function", async () => {
    await UsersRepository.update(fakeUser._id, fakeUser);

    expect(WiredcraftDBMock.update).toHaveBeenCalledTimes(1);
    expect(WiredcraftDBMock.update).toHaveBeenCalledWith(
      collectionName,
      fakeUser._id,
      fakeUser
    );
  });
});
