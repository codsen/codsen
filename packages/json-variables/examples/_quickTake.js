// Quick Take

import { strict as assert } from "assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar({
    a: "some text %%_var1.key1.0_%% more text %%_var2.key2.key3.1_%%",
    b: "something",
    var1: { key1: ["value1"] },
    var2: { key2: { key3: ["", "value2"] } },
  }),
  {
    a: "some text value1 more text value2",
    b: "something",
    var1: { key1: ["value1"] },
    var2: { key2: { key3: ["", "value2"] } },
  }
);
