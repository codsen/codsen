// Quick Take

import { strict as assert } from "assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

// processing an arbitrary, custom templating markup:
assert.deepEqual(
  strFindHeadsTails(
    "some text %%_var1-%% more text %%_var2_%%",
    ["%%_", "%%-"], // two flavours of heads
    ["-%%", "_%%"] // two flavours of tails
  ),
  [
    {
      headsStartAt: 10,
      headsEndAt: 13,
      tailsStartAt: 17,
      tailsEndAt: 20,
    },
    {
      headsStartAt: 31,
      headsEndAt: 34,
      tailsStartAt: 38,
      tailsEndAt: 41,
    },
  ]
);
