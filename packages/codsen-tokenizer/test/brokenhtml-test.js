// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
import deepContains from "ast-deep-contains";

// 01. rule tag-space-after-opening-bracket
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`tag-space-after-opening-bracket`}\u001b[${39}m`} - 1`, t => {
  const gathered = [];
  ct(`a < b class="">`, obj => {
    gathered.push(obj);
  });
  deepContains(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2
      },
      {
        type: "html",
        start: 2,
        end: 15
      }
    ],
    t.is,
    t.fail
  );
});
