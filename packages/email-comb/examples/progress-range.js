import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const reported = [];
const source = `<style>.used{color:red}</style><body class="used">${"text ".repeat(
  300,
)}</body>`;

comb(source, {
  reportProgressFunc: (percentage) => reported.push(percentage),
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 40,
});

assert.equal(reported.length > 0, true);
assert.equal(
  reported.every((value) => value >= 20 && value <= 40),
  true,
);
