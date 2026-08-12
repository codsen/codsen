// Observe progress in a custom interval

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const progress = [];
const source = `<style>${".a { color: red; }\n".repeat(1000)}</style>`;

crush(source, {
  reportProgressFunc: (percentage) => progress.push(percentage),
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 40,
});

assert.equal(progress.length > 0, true);
assert.equal(
  progress.every((value) => value >= 20 && value <= 40),
  true,
);
