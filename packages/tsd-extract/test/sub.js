import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

// -----------------------------------------------------------------------------

test("01 - extracts sub-keys + fixes indentation", () => {
  let source = `
interface Opts {
  foo: string;
  bar: {
    baz?: "a";
    faz: "z";
  };
  "yo": boolean;
}
`;
  equal(
    extract(source, "Opts.bar", {
      extractAll: true,
      semi: true, // <---
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 1,
      identifiersEndAt: 15,
      content: `{\n  baz?: "a";\n  faz: "z";\n};`,
      contentStartsAt: 40,
      contentEndsAt: 75,
      value: `bar: {\n  baz?: "a";\n  faz: "z";\n};`,
      valueStartsAt: 35,
      valueEndsAt: 75,
      all: ["Opts"],
      error: null,
    },
    "01.01"
  );
  equal(
    extract(source, "Opts.bar", {
      extractAll: true,
      semi: false, // <---
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 1,
      identifiersEndAt: 15,
      content: `{\n  baz?: "a";\n  faz: "z";\n}`,
      contentStartsAt: 40,
      contentEndsAt: 74,
      value: `bar: {\n  baz?: "a";\n  faz: "z";\n}`,
      valueStartsAt: 35,
      valueEndsAt: 74,
      all: ["Opts"],
      error: null,
    },
    "01.02"
  );
});

test("02 - can't find subkey, although first level key exists", () => {
  let source = `
interface Opts {
  foo: string;
  bar: {
    baz?: "a";
    faz: "z";
  };
  "yo": boolean;
}
`;
  equal(
    extract(source, "Opts.zzz", {
      extractAll: true,
      semi: true, // <---
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 1,
      identifiersEndAt: 15,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      all: ["Opts"],
      error: "not found",
    },
    "02.01"
  );
  equal(
    extract(source, "Opts.zzz", {
      extractAll: true,
      semi: false, // <---
    }),
    {
      identifiers: ["interface", "Opts"],
      identifiersStartAt: 1,
      identifiersEndAt: 15,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      all: ["Opts"],
      error: "not found",
    },
    "02.02"
  );
});

test("03 - can't find neither level keys", () => {
  let source = `
interface Opts {
  foo: string;
  bar: {
    baz?: "a";
    faz: "z";
  };
  "yo": boolean;
}
`;
  equal(
    extract(source, "zzz.yyy", {
      extractAll: true,
      semi: true, // <---
    }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      all: ["Opts"],
      error: "not found",
    },
    "03.01"
  );
  equal(
    extract(source, "zzz.yyy", {
      extractAll: true,
      semi: false, // <---
    }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      all: ["Opts"],
      error: "not found",
    },
    "03.02"
  );
});

test.run();
