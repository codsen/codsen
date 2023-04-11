/* eslint no-template-curly-in-string:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";
// const openingCurly = "\x7B";

// Imaginary tempating languages
// -----------------------------------------------------------------------------

test("01 - mirrorred-character heads and tails", () => {
  let gathered = [];
  let input = "<$ yo $>";
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "esp",
        start: 0,
        end: 8,
        value: input,
        head: "<$",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "$>",
        tailStartsAt: 6,
        tailEndsAt: 8,
      },
    ]),
    "01.01"
  );
});

test.run();
