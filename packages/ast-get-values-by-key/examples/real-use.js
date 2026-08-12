// Replace all null's in keys `amount` with zero, but only under `orders`

import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

const source = {
  orders: [
    {
      date: "2020-09-26",
      amount: null, // replace
      product: "Bramble",
    },
    {
      date: "2020-09-26",
      amount: 2,
      product: "Croodle",
    },
    {
      date: "2020-09-26",
      amount: null, // replace
      product: "Zapple",
    },
  ],
};

// first GET
const findings = getByKey(
  source, // what to process
  "amount", // what to look for
);
assert.equal(findings.length, 3);

// prepare replacement array for SET third input argument
const replacement = findings.map(({ val }) => +val);
assert.equal(replacement.join(","), "0,2,0");

// then SET
const result = getByKey(
  source, // what to process
  "amount", // what to look for
  replacement, // pot of replacement values to consume (single-use, FIFO stack)
);
assert.deepEqual(result, {
  orders: [
    {
      date: "2020-09-26",
      amount: 0, // replace
      product: "Bramble",
    },
    {
      date: "2020-09-26",
      amount: 2,
      product: "Croodle",
    },
    {
      date: "2020-09-26",
      amount: 0, // replace
      product: "Zapple",
    },
  ],
});
