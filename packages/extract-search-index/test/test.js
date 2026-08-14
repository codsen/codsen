// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { extract, version } from "../dist/extract-search-index.esm.js";

// API / Throws
// -------------------------------------------------------------------

test("01 - exports a version", () => {
  ok(/\d+\.\d+\.\d+/.test(version), "01.01");
});

test("02 - wrong/missing input = throw", () => {
  throws(
    () => {
      extract();
    },
    /THROW_ID_01/g,
    "02.01",
  );
  throws(
    () => {
      extract(1);
    },
    /THROW_ID_01/g,
    "02.02",
  );
  throws(
    () => {
      extract(null);
    },
    /THROW_ID_01/g,
    "02.03",
  );
  throws(
    () => {
      extract(undefined);
    },
    /THROW_ID_01/g,
    "02.04",
  );
  throws(
    () => {
      extract(true);
    },
    /THROW_ID_01/g,
    "02.05",
  );
});

// Normal use
// -------------------------------------------------------------------

test("03 - empty str input", () => {
  equal(extract(""), "", "03.01");
});

test("04 - whitespace only", () => {
  equal(extract("\n \n \r \r"), "", "04.01");
});

test("05 - one word", () => {
  equal(extract("zzz"), "zzz", "05.01");
});

test("06 - two words", () => {
  equal(extract("zzz yyy"), "zzz yyy", "06.01");
});

test("07 - two of the same", () => {
  equal(extract(" zzz \n zzz"), "zzz", "07.01");
});

test("08 - tackles emoji", () => {
  equal(extract("the quick brown fox 🦊"), "quick brown fox", "08.01");
});

test("09 - tackles stray astral characters", () => {
  equal(extract("Lazy\uD800lazy\uD83Ddog!\uDBFF"), "lazy dog", "09.01");
});

test("10 - tackles pair surrogates", () => {
  equal(extract("abc \uD83D\uDE0A def"), "abc def", "10.01");
});

test("11 - strips URL's (raw text)", () => {
  equal(extract("visit https://www.bbc.co.uk"), "visit", "11.01");
});

test("12 - strips URL's (markdown)", () => {
  equal(extract("[visit](https://www.bbc.co.uk)"), "visit", "12.01");
});

test("13 - hostile invalid inputs preserve the validation error", () => {
  function caughtFrom(value) {
    try {
      extract(value);
    } catch (error) {
      return error;
    }
    throw new Error("expected extract() to reject the hostile input");
  }

  const circular = {};
  circular.self = circular;
  let getterCalls = 0;
  const getterInput = {};
  Object.defineProperty(getterInput, "hostile", {
    enumerable: true,
    get() {
      getterCalls += 1;
      throw new Error("getter must not run");
    },
  });
  let toJsonCalls = 0;
  const toJsonInput = {
    value: 1,
    toJSON() {
      toJsonCalls += 1;
      throw new Error("toJSON must not run");
    },
  };
  const toJsonDescriptors = Object.getOwnPropertyDescriptors(toJsonInput);
  const hostileProxy = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("ownKeys trap");
      },
    },
  );
  const errors = [
    caughtFrom(1n),
    caughtFrom(circular),
    caughtFrom(getterInput),
    caughtFrom(toJsonInput),
    caughtFrom(hostileProxy),
    caughtFrom(Symbol("hostile")),
    caughtFrom(() => "hostile"),
    caughtFrom({ value: "x".repeat(100_000) }),
  ];

  errors.forEach((error, index) => {
    is(
      error.constructor,
      Error,
      `13.${String(index * 2 + 1).padStart(2, "0")}`,
    );
    match(
      error.message,
      /^extract-search-index\/extract\(\): \[THROW_ID_01\]/,
      `13.${String(index * 2 + 2).padStart(2, "0")}`,
    );
  });
  is(circular.self, circular, "13.17");
  is(getterCalls, 0, "13.18");
  is(toJsonCalls, 0, "13.19");
  equal(
    Object.getOwnPropertyDescriptors(toJsonInput),
    toJsonDescriptors,
    "13.20",
  );
  ok(errors.at(-1).message.length <= 2200, "13.21");
});

// TODO - blocked by string-strip-html
// test("12 - tackles markdown quote blocks", () => {
//   equal(
//     extract(`
// > "To be or not to be?"
// > —Hamlet
//   `),
//     "tbc",
//     "12"
//   );
// });

test.run();
