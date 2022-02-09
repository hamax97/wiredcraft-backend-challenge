test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

test("object assignment", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  // expect(value).toBe(0.3);  //         This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});

function fetchData(cb) {
  setTimeout(() => {
    cb("peanut butter");
  }, 0);
}

test("the data is peanut butter", (done) => {
  function callback(data) {
    try {
      expect(data).toBe("peanut butter");
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});

function fetchData2() {
  return new Promise((res, rej) => {
    rej("error");
  });
}

test("promise: the data is peanut butter", () => {
  // expect.assertions(1);
  return expect(fetchData2()).rejects.toBe("error");
});

async function fetchData3() {
  return "peanut butter";
}

test("async: the data is peanut butter", async () => {
  const data = await fetchData3();
  expect(data).toBe("peanut butter");
});

async function fetchData4() {
  throw new Error("error");
}

test("async: the fetch throws error", async () => {
  expect.assertions(1);
  try {
    await fetchData4();
  } catch (err) {
    expect(err).toEqual(new Error("error"));
  }
});

test("async: the fetch throws error", async () => {
  await expect(fetchData4()).rejects.toThrow(new Error("error"));
});
