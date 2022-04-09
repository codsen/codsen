import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - baseline", () => {
  let source = `export { a } from "b";
export { c } from "d";`;
  equal(
    extract(source, "export", {
      extractAll: false,
      mustInclude: undefined,
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
});

test.run();
