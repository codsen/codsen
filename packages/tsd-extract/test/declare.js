import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - minimal", () => {
  let source = `declare type Token1 = "ab" | "cd";
declare type Token2 = "ef" | "gh";`;

  // extractAll == true

  equal(
    extract(source, "Token1", { extractAll: true }),
    {
      identifiers: ["declare", "type", "Token1"],
      identifiersStartAt: 0,
      identifiersEndAt: 19,
      content: '= "ab" | "cd";',
      contentStartsAt: 20,
      contentEndsAt: 34,
      value: 'declare type Token1 = "ab" | "cd";',
      valueStartsAt: 0,
      valueEndsAt: 34,
      error: null,
      all: ["Token1", "Token2"],
    },
    "01.01",
  );
  equal(
    extract(source, "Token2", { extractAll: true }),
    {
      identifiers: ["declare", "type", "Token2"],
      identifiersStartAt: 35,
      identifiersEndAt: 54,
      content: '= "ef" | "gh";',
      contentStartsAt: 55,
      contentEndsAt: 69,
      value: 'declare type Token2 = "ef" | "gh";',
      valueStartsAt: 35,
      valueEndsAt: 69,
      error: null,
      all: ["Token1", "Token2"],
    },
    "01.02",
  );

  // extractAll == false

  equal(
    extract(source, "Token1", { extractAll: false }),
    {
      identifiers: ["declare", "type", "Token1"],
      identifiersStartAt: 0,
      identifiersEndAt: 19,
      content: '= "ab" | "cd";',
      contentStartsAt: 20,
      contentEndsAt: 34,
      value: 'declare type Token1 = "ab" | "cd";',
      valueStartsAt: 0,
      valueEndsAt: 34,
      error: null,
      all: [],
    },
    "01.03",
  );
  equal(
    extract(source, "Token2", { extractAll: false }),
    {
      identifiers: ["declare", "type", "Token2"],
      identifiersStartAt: 35,
      identifiersEndAt: 54,
      content: '= "ef" | "gh";',
      contentStartsAt: 55,
      contentEndsAt: 69,
      value: 'declare type Token2 = "ef" | "gh";',
      valueStartsAt: 35,
      valueEndsAt: 69,
      error: null,
      all: [],
    },
    "01.04",
  );
});

test("02 - declare const typeof", () => {
  let source = `declare const util: {
  matchLayerLast: typeof matchLayerLast;
};`;

  // extractAll == true

  equal(
    extract(source, "util", { extractAll: true }),
    {
      identifiers: ["declare", "const", "util"],
      identifiersStartAt: 0,
      identifiersEndAt: 18,
      content: `{
  matchLayerLast: typeof matchLayerLast;
};`,
      contentStartsAt: 20,
      contentEndsAt: 65,
      value: source,
      valueStartsAt: 0,
      valueEndsAt: 65,
      error: null,
      all: ["util"],
    },
    "02.01",
  );

  // extractAll == false

  equal(
    extract(source, "util", { extractAll: false }),
    {
      identifiers: ["declare", "const", "util"],
      identifiersStartAt: 0,
      identifiersEndAt: 18,
      content: `{
  matchLayerLast: typeof matchLayerLast;
};`,
      contentStartsAt: 20,
      contentEndsAt: 65,
      value: source,
      valueStartsAt: 0,
      valueEndsAt: 65,
      error: null,
      all: [],
    },
    "02.02",
  );
});

test("03 - multiple", () => {
  let source = `declare function abc(def: string): Ghi;
declare const xy: {
  klm: typeof nop;
};`;

  // extractAll == true
  equal(
    extract(source, "abc", { extractAll: true }),
    {
      identifiers: ["declare", "function", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 20,
      content: "(def: string): Ghi;",
      contentStartsAt: 20,
      contentEndsAt: 39,
      value: "declare function abc(def: string): Ghi;",
      valueStartsAt: 0,
      valueEndsAt: 39,
      error: null,
      all: ["abc", "xy"],
    },
    "03.01",
  );
  equal(
    extract(source, "xy", { extractAll: true }),
    {
      identifiers: ["declare", "const", "xy"],
      identifiersStartAt: 40,
      identifiersEndAt: 56,
      content: `{
  klm: typeof nop;
};`,
      contentStartsAt: 58,
      contentEndsAt: 81,
      value: `declare const xy: {
  klm: typeof nop;
};`,
      valueStartsAt: 40,
      valueEndsAt: 81,
      error: null,
      all: ["abc", "xy"],
    },
    "03.02",
  );

  // extractAll == false
  equal(
    extract(source, "abc", { extractAll: false }),
    {
      identifiers: ["declare", "function", "abc"],
      identifiersStartAt: 0,
      identifiersEndAt: 20,
      content: "(def: string): Ghi;",
      contentStartsAt: 20,
      contentEndsAt: 39,
      value: "declare function abc(def: string): Ghi;",
      valueStartsAt: 0,
      valueEndsAt: 39,
      error: null,
      all: [],
    },
    "03.03",
  );
  equal(
    extract(source, "xy", { extractAll: false }),
    {
      identifiers: ["declare", "const", "xy"],
      identifiersStartAt: 40,
      identifiersEndAt: 56,
      content: `{
  klm: typeof nop;
};`,
      contentStartsAt: 58,
      contentEndsAt: 81,
      value: `declare const xy: {
  klm: typeof nop;
};`,
      valueStartsAt: 40,
      valueEndsAt: 81,
      error: null,
      all: [],
    },
    "03.04",
  );
});

test("04 - two declares, empty search string", () => {
  equal(
    extract(
      `
declare function abc(def: string): Ghi;
// declare tralala
declare const xy: {
  klm: typeof nop;
};
`,
      "",
      {
        extractAll: true,
      },
    ),
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
      all: ["abc", "xy"],
      error: "not found",
    },
    "04.01",
  );
});

test("05 - mixed", () => {
  let source = `
declare const a: B;
interface C {
  d: e;
}
`;
  equal(
    extract(source, "a", {
      extractAll: true,
    }),
    {
      identifiers: ["declare", "const", "a"],
      identifiersStartAt: 1,
      identifiersEndAt: 16,
      content: ": B;",
      contentStartsAt: 16,
      contentEndsAt: 20,
      value: "declare const a: B;",
      valueStartsAt: 1,
      valueEndsAt: 20,
      all: ["a", "C"],
      error: null,
    },
    "05.01",
  );
  equal(
    extract(source, "C", {
      extractAll: true,
    }),
    {
      identifiers: ["interface", "C"],
      identifiersStartAt: 21,
      identifiersEndAt: 32,
      content: `{
  d: e;
}`,
      contentStartsAt: 33,
      contentEndsAt: 44,
      value: `interface C {
  d: e;
}`,
      valueStartsAt: 21,
      valueEndsAt: 44,
      all: ["a", "C"],
      error: null,
    },
    "05.02",
  );
});

test.run();
