import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - baseline", () => {
  let source = `export { a } from "b";
export { c } from "d";`;
  // semi = true
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: undefined,
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { a } from "b";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: [],
      error: null,
    },
    "01.01"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: undefined,
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { a } from "b";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: ["export"],
      error: null,
    },
    "01.02"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "a",
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { a } from "b";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: [],
      error: null,
    },
    "01.03"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "a",
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { a } from "b";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: ["export"],
      error: null,
    },
    "01.04"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "zzz",
      semi: true,
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
      all: [],
      error: "not found",
    },
    "01.05"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "zzz",
      semi: true,
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
      all: ["export"],
      error: "not found",
    },
    "01.06"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "c",
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 23,
      identifiersEndAt: 29,
      content: '{ c } from "d";',
      contentStartsAt: 30,
      contentEndsAt: 45,
      value: 'export { c } from "d";',
      valueStartsAt: 23,
      valueEndsAt: 45,
      all: [],
      error: null,
    },
    "01.07"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "c",
      semi: true,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 23,
      identifiersEndAt: 29,
      content: '{ c } from "d";',
      contentStartsAt: 30,
      contentEndsAt: 45,
      value: 'export { c } from "d";',
      valueStartsAt: 23,
      valueEndsAt: 45,
      all: ["export"],
      error: null,
    },
    "01.08"
  );

  // semi = false
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: undefined,
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b"',
      contentStartsAt: 7,
      contentEndsAt: 21,
      value: 'export { a } from "b"',
      valueStartsAt: 0,
      valueEndsAt: 21,
      all: [],
      error: null,
    },
    "01.09"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: undefined,
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b"',
      contentStartsAt: 7,
      contentEndsAt: 21,
      value: 'export { a } from "b"',
      valueStartsAt: 0,
      valueEndsAt: 21,
      all: ["export"],
      error: null,
    },
    "01.10"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "a",
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b"',
      contentStartsAt: 7,
      contentEndsAt: 21,
      value: 'export { a } from "b"',
      valueStartsAt: 0,
      valueEndsAt: 21,
      all: [],
      error: null,
    },
    "01.11"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "a",
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ a } from "b"',
      contentStartsAt: 7,
      contentEndsAt: 21,
      value: 'export { a } from "b"',
      valueStartsAt: 0,
      valueEndsAt: 21,
      all: ["export"],
      error: null,
    },
    "01.12"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "zzz",
      semi: false,
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
      all: [],
      error: "not found",
    },
    "01.13"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "zzz",
      semi: false,
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
      all: ["export"],
      error: "not found",
    },
    "01.14"
  );
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: "c",
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 23,
      identifiersEndAt: 29,
      content: '{ c } from "d"',
      contentStartsAt: 30,
      contentEndsAt: 44,
      value: 'export { c } from "d"',
      valueStartsAt: 23,
      valueEndsAt: 44,
      all: [],
      error: null,
    },
    "01.15"
  );
  equal(
    extract(source, "export", {
      extractAll: true,
      mustInclude: "c",
      semi: false,
    }),
    {
      identifiers: ["export"],
      identifiersStartAt: 23,
      identifiersEndAt: 29,
      content: '{ c } from "d"',
      contentStartsAt: 30,
      contentEndsAt: 44,
      value: 'export { c } from "d"',
      valueStartsAt: 23,
      valueEndsAt: 44,
      all: ["export"],
      error: null,
    },
    "01.16"
  );
});

test.run();
