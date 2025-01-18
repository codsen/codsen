import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

// various broken, imaginary and edge-case code to test algorithm edge cases
// -----------------------------------------------------------------------------

test("01 - content missing, semi", () => {
  equal(
    extract("interface abc;", "abc", {
      extractAll: true,
      semi: true,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc;",
      valueStartsAt: 0,
      valueEndsAt: 14,
      all: ["abc"],
      error: null,
    },
    "01.01",
  );
  equal(
    extract("interface abc;", "abc", {
      extractAll: false,
      semi: true,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc;",
      valueStartsAt: 0,
      valueEndsAt: 14,
      all: [],
      error: null,
    },
    "01.02",
  );
  equal(
    extract("interface abc;", "abc", {
      extractAll: true,
      semi: false,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: ["abc"],
      error: null,
    },
    "01.03",
  );
  equal(
    extract("interface abc;", "abc", {
      extractAll: false,
      semi: false,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: [],
      error: null,
    },
    "01.04",
  );
});

test("02 - content missing, no semi", () => {
  equal(
    extract("interface abc", "abc", {
      extractAll: true,
      semi: true,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: ["abc"],
      error: null,
    },
    "02.01",
  );
  equal(
    extract("interface abc", "abc", {
      extractAll: false,
      semi: true,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: [],
      error: null,
    },
    "02.02",
  );
  equal(
    extract("interface abc", "abc", {
      extractAll: true,
      semi: false,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: ["abc"],
      error: null,
    },
    "02.03",
  );
  equal(
    extract("interface abc", "abc", {
      extractAll: false,
      semi: false,
    }),
    {
      identifiers: ["interface", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 13,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "interface abc",
      valueStartsAt: 0,
      valueEndsAt: 13,
      all: [],
      error: null,
    },
    "02.04",
  );
});

test.run();
