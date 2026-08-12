// Replace a match with an object that omits an unwanted property

import { strict as assert } from "node:assert";

import { getObj } from "../dist/ast-get-object.esm.js";

assert.deepEqual(
  getObj(
    [{ tag: [["meta"]], content: "UTF-8", obsolete: true }],
    { tag: [["meta"]] },
    [{ content: "UTF-8" }],
  ),
  [{ content: "UTF-8" }],
);
