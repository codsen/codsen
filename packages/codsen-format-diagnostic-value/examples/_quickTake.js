// Quick Take

import { strict as assert } from "node:assert";

import { formatDiagnosticValue } from "../dist/codsen-format-diagnostic-value.esm.js";

assert.equal(
  formatDiagnosticValue({ input: Symbol("marker") }),
  '{"input":Symbol("marker")}',
);
