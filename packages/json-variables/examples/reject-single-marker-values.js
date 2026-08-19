// Reject values containing a lone marker

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.throws(
  () => jVar({ value: "%%_" }, { noSingleMarkers: true }),
  /THROW_ID_21/,
);
