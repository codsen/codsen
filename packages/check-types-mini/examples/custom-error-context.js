// Customise validation error context

import { strict as assert } from "node:assert";

import {
  CheckTypesMiniError,
  checkTypesMini,
} from "../dist/check-types-mini.esm.js";

assert.throws(
  () => {
    checkTypesMini(
      { enabled: "yes" },
      { enabled: false },
      { msg: "buildConfig", optsVarName: "config" },
    );
  },
  (error) => {
    assert(error instanceof CheckTypesMiniError);
    assert.equal(error.context, "buildConfig");
    assert.equal(error.path[0], "enabled");
    return true;
  },
);
