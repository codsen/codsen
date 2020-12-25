// Quick Take

import { strict as assert } from "assert";
import { isEmpty } from "../dist/ast-is-empty.esm.js";

assert.equal(
  isEmpty({
    a: "",
  }),
  true
);

assert.equal(
  isEmpty({
    a: [""],
    b: {
      c: {
        d: "",
      },
    },
  }),
  true
);

assert.equal(
  isEmpty([
    {
      a: [""],
      b: { c: { d: "" } },
    },
    "",
    ["", "", ""],
  ]),
  true
);
