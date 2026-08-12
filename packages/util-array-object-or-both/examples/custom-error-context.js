import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.throws(
  () =>
    arrObjOrBoth("map", {
      msg: "renderer/configure(): [THROW_ID_03]",
      optsVarName: "only",
    }),
  /renderer\/configure\(\): \[THROW_ID_03\].*variable "only".*map/,
);
