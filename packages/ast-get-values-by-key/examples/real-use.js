// Replace all null's in keys `amount` with zero, but only under `orders`

import { strict as assert } from "assert";

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
  "amount" // what to look for
);
assert.deepEqual(findings, [
  { val: null, path: "orders.0.amount" },
  { val: 2, path: "orders.1.amount" },
  { val: null, path: "orders.2.amount" },
]);

// prepare replacement array for SET third input argument
const replacement = findings.map(({ val }) => +val);
assert.deepEqual(replacement, [0, 2, 0]);

// then SET
const result = getByKey(
  source, // what to process
  "amount", // what to look for
  replacement // pot of replacement values to consume (single-use, FIFO stack)
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
