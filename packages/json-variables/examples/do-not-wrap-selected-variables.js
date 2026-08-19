// Leave the selected variables unwrapped

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      output: "%%_publicName_%% / %%_internalCode_%%",
      publicName: "Ada",
      internalCode: "A1",
    },
    {
      wrapHeadsWith: "<",
      wrapTailsWith: ">",
      dontWrapVars: "internal*",
    },
  ),
  {
    output: "<Ada> / A1",
    publicName: "Ada",
    internalCode: "A1",
  },
);
