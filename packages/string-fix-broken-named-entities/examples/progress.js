// Observe scan progress

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const percentages = [];
const source = "text &ang text&ang text ".repeat(10);

fixEnt(source, {
  progressFn: (percentage) => percentages.push(percentage),
});

assert.equal(percentages.length > 0, true);
assert.equal(
  percentages.every((value) => value >= 0 && value <= 100),
  true,
);
