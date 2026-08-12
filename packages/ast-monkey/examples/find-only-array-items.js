import { strict as assert } from "node:assert";

import { find } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  find(
    { objectValue: "remove", items: ["keep", "remove"] },
    {
      key: "remove",
      only: "array",
    },
  ),
  [
    {
      index: 4,
      key: "remove",
      val: undefined,
      path: [2, 4],
    },
  ],
);
