// Omit keys and clone retained values

import { strict as assert } from "node:assert";

import { omit } from "../dist/codsen-utils.esm.js";

const source = { password: "secret", profile: { name: "Ada" } };
const result = omit(source, ["password"]);

assert.deepEqual(result, { profile: { name: "Ada" } });
assert.notEqual(result.profile, source.profile);
