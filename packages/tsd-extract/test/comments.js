import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - minimal", () => {
  let source = `
/**
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 */
declare function tokenizer(str: string, originalOpts?: Partial<Opts>): Res;`;
  equal(
    extract(source, "tokenizer", { extractAll: true }),
    {
      identifiers: ["declare", "function", "tokenizer"],
      identifiersStartAt: 95,
      identifiersEndAt: 121,
      content: "(str: string, originalOpts?: Partial<Opts>): Res;",
      contentStartsAt: 121,
      contentEndsAt: 170,
      value:
        "declare function tokenizer(str: string, originalOpts?: Partial<Opts>): Res;",
      valueStartsAt: 95,
      valueEndsAt: 170,
      error: null,
      all: ["tokenizer"],
    },
    "01.01",
  );
  equal(
    extract(source, "tokenizer", { extractAll: false }),
    {
      identifiers: ["declare", "function", "tokenizer"],
      identifiersStartAt: 95,
      identifiersEndAt: 121,
      content: "(str: string, originalOpts?: Partial<Opts>): Res;",
      contentStartsAt: 121,
      contentEndsAt: 170,
      value:
        "declare function tokenizer(str: string, originalOpts?: Partial<Opts>): Res;",
      valueStartsAt: 95,
      valueEndsAt: 170,
      error: null,
      all: [],
    },
    "01.02",
  );
});

test.run();
