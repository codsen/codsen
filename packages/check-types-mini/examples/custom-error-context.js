// Customise validation error context

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.throws(() => {
  checkTypesMini(
    { enabled: "yes" },
    { enabled: false },
    { msg: "buildConfig", optsVarName: "config" },
  );
}, /buildConfig: config\.enabled was customised/);
