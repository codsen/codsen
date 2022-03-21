import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - minimal, #1", () => {
  let source = `interface abc {
  xyz
}
interface def {
  ghi
}`;
  equal(
    extract(source, "abc", {
      extractAll: false,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: `{\n  xyz\n}`,
      contentStartsAt: 14,
      contentEndsAt: 23,
      value: `interface abc {\n  xyz\n}`,
      valueStartsAt: 0,
      valueEndsAt: 23,
      all: [],
      error: null,
    },
    "01.01"
  );
  equal(
    extract(source, "abc", {
      extractAll: true,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: `{\n  xyz\n}`,
      contentStartsAt: 14,
      contentEndsAt: 23,
      value: `interface abc {\n  xyz\n}`,
      valueStartsAt: 0,
      valueEndsAt: 23,
      all: ["abc", "def"],
      error: null,
    },
    "01.02"
  );
});

test("02 - minimal, #2", () => {
  let source = `interface abc {
  xyz
}
interface def {
  ghi
}`;
  equal(
    extract(source, "def", {
      extractAll: true,
    }),
    {
      identifiers: ["interface", "def"],
      identifiersStartAt: 24,
      identifiersEndAt: 37,
      content: `{\n  ghi\n}`,
      contentStartsAt: 38,
      contentEndsAt: 47,
      value: `interface def {\n  ghi\n}`,
      valueStartsAt: 24,
      valueEndsAt: 47,
      all: ["abc", "def"],
      error: null,
    },
    "02.01"
  );
  equal(
    extract(source, "def", {
      extractAll: false,
    }),
    {
      identifiers: ["interface", "def"],
      identifiersStartAt: 24,
      identifiersEndAt: 37,
      content: `{\n  ghi\n}`,
      contentStartsAt: 38,
      contentEndsAt: 47,
      value: `interface def {\n  ghi\n}`,
      valueStartsAt: 24,
      valueEndsAt: 47,
      all: [],
      error: null,
    },
    "02.02"
  );
});

test("03 - extracts an interface contents", () => {
  let source = `
interface HeadsAndTailsObj {
  heads: string;
  tails: string;
}
interface Opts {
  whitelist: string[];
  backend: HeadsAndTailsObj[];
}
interface Res {
  log: {
    timeTakenInMilliseconds: number;
  };
  result: string;
}`;
  equal(
    extract(source, "Opts", {
      extractAll: true,
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 66,
      identifiersEndAt: 80,
      content: `{\n  whitelist: string[];\n  backend: HeadsAndTailsObj[];\n}`,
      contentStartsAt: 81,
      contentEndsAt: 138,
      value: `interface Opts {\n  whitelist: string[];\n  backend: HeadsAndTailsObj[];\n}`,
      valueStartsAt: 66,
      valueEndsAt: 138,
      all: ["HeadsAndTailsObj", "Opts", "Res"],
      error: null,
    },
    "03.01"
  );
  equal(
    extract(source, "Opts", {
      extractAll: false,
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 66,
      identifiersEndAt: 80,
      content: `{\n  whitelist: string[];\n  backend: HeadsAndTailsObj[];\n}`,
      contentStartsAt: 81,
      contentEndsAt: 138,
      value: `interface Opts {\n  whitelist: string[];\n  backend: HeadsAndTailsObj[];\n}`,
      valueStartsAt: 66,
      valueEndsAt: 138,
      all: [],
      error: null,
    },
    "03.02"
  );
});

test.run();
