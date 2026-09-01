// `opts.hungryForWhitespace`

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// by default, key values will be strictly matched using `===`
assert.equal(
  compare(
    { a: "\n\n\n", b: "\t\t\t", c: "whatever" },
    { a: "\r\r\r", b: "       " },
    {
      hungryForWhitespace: false,
    },
  ),
  false,
);

// whitespace is matched leniently with the following option:
assert.equal(
  compare(
    { a: "\n\n\n", b: "\t\t\t", c: "whatever" },
    { a: "\r\r\r", b: "       " },
    {
      hungryForWhitespace: true,
    },
  ),
  true,
);

// Empty structures containing only whitespace strings also match:
assert.equal(
  compare(
    { a: { z: "\n\n\n" }, b: ["\t\t\t"], c: "whatever" },
    { a: [[[[["\r\r\r"]]]]], b: { c: { d: " " } } },
    {
      hungryForWhitespace: true, // <--- !
    },
  ),
  true, // <--- !!!
);
// An empty value is:
//   - string that trims to zero-length
//   - array with zero or more whitespace strings only
//   - plain object with zero or more keys with "empty" values
//     (empty arrays, empty plain objects or empty strings)
