// Treat a custom element as inline

import { strict as assert } from "node:assert";

import { crush, defaults } from "../dist/html-crush.esm.js";

const source = "<i>a</i><y>b</y>";

assert.equal(
  crush(source, { lineLengthLimit: 9, removeLineBreaks: true }).result,
  "<i>a</i>\n<y>b</y>",
);
assert.equal(
  crush(source, {
    lineLengthLimit: 9,
    removeLineBreaks: true,
    mindTheInlineTags: [...defaults.mindTheInlineTags, "y"],
  }).result,
  source,
);
