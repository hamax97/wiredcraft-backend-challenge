jest.mock("../../src/shared/wiredcraftDB", () => ({
  create: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
}));

const wiredcraftDBMock = require("../../src/shared/wiredcraftDB");
const usersRepository = require("../../src/repositories/users");

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
    await expect(usersRepository.create()).rejects.toThrowError(error);

    await expect(
      usersRepository.create({ dob: fakeUser.dob, address: fakeUser.address })
    ).rejects.toThrowError(error);

    await expect(
      usersRepository.create({
        name: fakeUser.name,
        address: fakeUser.address,
      })
    ).rejects.toThrowError(error);

    await expect(
      usersRepository.create({ name: fakeUser.name, dob: fakeUser.dob })
    ).rejects.toThrowError(error);
  });

  test("adds createdAt property to given user", async () => {
    await usersRepository.create(fakeUser);

    expect(fakeUser).toHaveProperty("createdAt");
    expect(fakeUser.createdAt).toBeInstanceOf(Date);
  });

  test("calls database creation function", async () => {
    await usersRepository.create(fakeUser);
    expect(wiredcraftDBMock.create).toHaveBeenCalledTimes(1);
    expect(wiredcraftDBMock.create).toHaveBeenCalledWith(
      collectionName,
      fakeUser
    );
  });
});

describe("get", () => {
  test("throws if wrong input", async () => {
    const error = new Error("Invalid userId");

    await expect(usersRepository.get()).rejects.toThrowError(error);
    await expect(usersRepository.get(123)).rejects.toThrowError(error);
  });

  test("call get from database function", async () => {
    await usersRepository.get(fakeUser._id);

    expect(wiredcraftDBMock.get).toHaveBeenCalledTimes(1);
    expect(wiredcraftDBMock.get).toHaveBeenCalledWith(
      collectionName,
      fakeUser._id
    );
  });
});

describe("update", () => {
  test("throws if wrong input", async () => {
    const error1 = new Error("Invalid userId");

    await expect(usersRepository.update()).rejects.toThrowError(error1);
    await expect(usersRepository.update(123)).rejects.toThrowError(error1);

    const error2 = new Error("Invalid newUser");
    await expect(usersRepository.update(fakeUser._id)).rejects.toThrowError(
      error2
    );
    await expect(usersRepository.update(fakeUser._id, {})).rejects.toThrowError(
      error2
    );
  });

  test("calls database update function", async () => {
    await usersRepository.update(fakeUser._id, fakeUser);

    expect(wiredcraftDBMock.update).toHaveBeenCalledTimes(1);
    expect(wiredcraftDBMock.update).toHaveBeenCalledWith(
      collectionName,
      fakeUser._id,
      fakeUser
    );
  });
});
