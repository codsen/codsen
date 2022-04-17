import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - export from, one line", () => {
  let source = `export { x } from "y";`;
  equal(
    extract(source, "export", { extractAll: false }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ x } from "y";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { x } from "y";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: [],
      error: null,
    },
    "01.01"
  );
  equal(
    extract(source, "export", { extractAll: true }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ x } from "y";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { x } from "y";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: ["export"],
      error: null,
    },
    "01.02"
  );
});

test("02 - two exports from", () => {
  let source = `export { a } from "b";
export { c } from "d";`;
  equal(
    extract(source, "export", { extractAll: false }),
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
    "02.01"
  );
  equal(
    extract(source, "export", { extractAll: true }),
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
    "02.02"
  );
});

test("03 - others follow", () => {
  let source = `export { a } from "b";
declare const c: string;
  `;
  equal(
    extract(source, "export", { extractAll: false }),
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
    "03.01"
  );
  equal(
    extract(source, "export", { extractAll: true }),
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
      all: ["export", "c"],
      error: null,
    },
    "03.02"
  );
});

test("04 - re-exports", () => {
  let source = `export { x as y } from "z";`;
  equal(
    extract(source, "export", { extractAll: false, stripAs: false }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ x as y } from "z";',
      contentStartsAt: 7,
      contentEndsAt: 27,
      value: 'export { x as y } from "z";',
      valueStartsAt: 0,
      valueEndsAt: 27,
      all: [],
      error: null,
    },
    "04.01"
  );
  equal(
    extract(source, "export", { extractAll: false, stripAs: true }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ y } from "z";',
      contentStartsAt: 7,
      contentEndsAt: 27,
      value: 'export { y } from "z";',
      valueStartsAt: 0,
      valueEndsAt: 27,
      all: [],
      error: null,
    },
    "04.02"
  );
});

test("05 - re-exports, more realistic", () => {
  let source = `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`;
  equal(
    extract(source, "export", { extractAll: false, stripAs: false }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: `{
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
      contentStartsAt: 7,
      contentEndsAt: 125,
      value: `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
      valueStartsAt: 0,
      valueEndsAt: 125,
      all: [],
      error: null,
    },
    "05.01"
  );
  equal(
    extract(source, "export", { extractAll: false, stripAs: true }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: `{
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
      contentStartsAt: 7,
      contentEndsAt: 125,
      value: `export {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
      valueStartsAt: 0,
      valueEndsAt: 125,
      all: [],
      error: null,
    },
    "05.02"
  );
});

test.run();
