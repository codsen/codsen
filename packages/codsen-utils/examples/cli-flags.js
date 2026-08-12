// Parse typed, short and repeatable CLI flags

import { strict as assert } from "node:assert";

import { codsenCLI } from "../dist/codsen-utils.esm.js";

const result = codsenCLI("", {
  argv: ["input.js", "-v", "--count=2", "-i", "a", "-i", "b"],
  autoHelp: false,
  autoVersion: false,
  booleanDefault: false,
  flags: {
    verbose: { type: "boolean", shortFlag: "v" },
    count: { type: "number", default: 1 },
    ignore: { type: "string", shortFlag: "i", isMultiple: true },
  },
});

assert.deepEqual(result.flags, {
  verbose: true,
  count: 2,
  ignore: ["a", "b"],
});
assert.equal(result.input[0], "input.js");
