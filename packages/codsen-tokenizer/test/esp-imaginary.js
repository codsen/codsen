/* eslint no-template-curly-in-string:0 */

import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";
// const openingCurly = "\x7B";

// Imaginary tempating languages
// -----------------------------------------------------------------------------

tap.test(`01 - mirrorred-character heads and tails`, (t) => {
  const gathered = [];
  const input = `<$ yo $>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
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
    ],
    "01"
  );
  t.end();
});
