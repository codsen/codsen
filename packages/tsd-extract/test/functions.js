import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - minimal", () => {
  let source = `declare function comb(str: string, originalOpts?: Partial<Opts>): Res;`;
  equal(
    extract(source, "comb", { extractAll: true, semi: true }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: `(str: string, originalOpts?: Partial<Opts>): Res;`,
      contentStartsAt: 21,
      contentEndsAt: 70,
      value: `declare function comb(str: string, originalOpts?: Partial<Opts>): Res;`,
      valueStartsAt: 0,
      valueEndsAt: 70,
      error: null,
      all: ["comb"],
    },
    "01.01"
  );
  equal(
    extract(source, "comb", { extractAll: false, semi: true }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: `(str: string, originalOpts?: Partial<Opts>): Res;`,
      contentStartsAt: 21,
      contentEndsAt: 70,
      value: `declare function comb(str: string, originalOpts?: Partial<Opts>): Res;`,
      valueStartsAt: 0,
      valueEndsAt: 70,
      error: null,
      all: [],
    },
    "01.02"
  );
  equal(
    extract(source, "comb", { extractAll: true, semi: false }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: `(str: string, originalOpts?: Partial<Opts>): Res`,
      contentStartsAt: 21,
      contentEndsAt: 69,
      value: `declare function comb(str: string, originalOpts?: Partial<Opts>): Res`,
      valueStartsAt: 0,
      valueEndsAt: 69,
      error: null,
      all: ["comb"],
    },
    "01.03"
  );
  equal(
    extract(source, "comb", { extractAll: false, semi: false }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: `(str: string, originalOpts?: Partial<Opts>): Res`,
      contentStartsAt: 21,
      contentEndsAt: 69,
      value: `declare function comb(str: string, originalOpts?: Partial<Opts>): Res`,
      valueStartsAt: 0,
      valueEndsAt: 69,
      error: null,
      all: [],
    },
    "01.04"
  );
});

test.run();
