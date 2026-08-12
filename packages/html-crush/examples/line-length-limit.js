// Wrap minified HTML at a line-length limit

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

assert.equal(
  crush("let me tell you <a><span>something</span></a> new", {
    lineLengthLimit: 10,
    removeLineBreaks: true,
  }).result,
  "let me\ntell you\n<a><span>something</span></a>\nnew",
);
