// Quick Take

import { strict as assert } from "assert";

import { overlap } from "../dist/string-overlap-one-on-another.esm.js";

assert.equal(overlap("aaa", "bbb", { offset: -2 }), "bbbaa");
