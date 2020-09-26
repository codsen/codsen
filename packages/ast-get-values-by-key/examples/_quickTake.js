/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import getAllValuesByKey from "../dist/ast-get-values-by-key.esm.js";

// GETTER
// ======

// returns "object-path" notation paths where arrays use dots:
assert.deepEqual(
  getAllValuesByKey(
    {
      parsed: [
        {
          tag: "html",
        },
      ],
    },
    "tag" // value to search for
  ),
  [{ val: "html", path: "parsed.0.tag" }]
);

// SETTER
// ======

assert.deepEqual(
  getAllValuesByKey(
    {
      parsed: [
        {
          tag: "html",
        },
      ],
      foo: {
        tag: null,
      },
      bar: {
        tag: null,
      },
    },
    "tag", // value to search for
    [123, 456] // pot of values to pick from (one result not enough)
  ),
  {
    parsed: [
      {
        tag: 123,
      },
    ],
    foo: {
      tag: 456,
    },
    bar: {
      tag: null, // value pot was depleted and there was nothing left to put here
    },
  }
);
