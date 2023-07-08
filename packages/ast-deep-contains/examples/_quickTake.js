// Quick Take

import { strict as assert } from "assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const gathered = [];
const errors = [];

const reference = [
  { c: "2" }, // will end up not used
  { a: "1", b: "2", c: "3" },
  { x: "8", y: "9", z: "0" },
];

const structureToMatch = [
  { a: "1", b: "2", c: "3" }, // matches but has different position in the source
  { x: "8", y: "9" }, // "z" missing
];

// This program pre-matches first, then matches objects as a set-subset
deepContains(
  reference,
  structureToMatch,
  (leftSideVal, rightSideVal) => {
    // This callback does the pre-matching and picks the key pairs for you.
    // It's up to you what you will do with left- and right-side
    // values - we normally feed them to unit test asserts but here we just push
    // to array:
    gathered.push([leftSideVal, rightSideVal]);
  },
  (err) => {
    errors.push(err);
  },
);

// imagine instead of pushing pairs into array, you fed them into assert
// function in unit tests:
assert.deepEqual(gathered, [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["8", "8"],
  ["9", "9"],
]);
assert.equal(errors.length, 0);
