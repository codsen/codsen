// Quick Take

import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

// returns "object-path" notation paths where arrays use dots:
assert.deepEqual(
  getByKey(
    {
      parsed: [
        {
          tag: "html",
        },
      ],
    },
    "tag", // value to search for
  ),
  [{ val: "html", path: "parsed.0.tag" }],
);
