// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
import deepContains from "ast-deep-contains";

// 01. healthy html, no tricks
// -----------------------------------------------------------------------------

test("01.01 - tag and text", t => {
  const gathered = [];
  ct("<a>z1", null, obj => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        chr: "<",
        i: 0,
        type: "html"
      },
      {
        chr: "a",
        i: 1,
        type: "html"
      },
      {
        chr: ">",
        i: 2,
        type: "html"
      },
      {
        chr: "z",
        i: 3,
        type: "text"
      },
      {
        chr: "1",
        i: 4,
        type: "text"
      }
    ],
    t.is,
    t.fail
  );
});
