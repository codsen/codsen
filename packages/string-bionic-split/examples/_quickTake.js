// Quick Take

import { strict as assert } from "assert";

import { split } from "../dist/string-bionic-split.esm.js";

const sources = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "a",
  "lazy",
  "dog",
];

const splitSources = sources.map(
  (str) => `${str.slice(0, split(str))} + ${str.slice(split(str))}`,
);

assert.deepEqual(splitSources, [
  "t + he",
  "qui + ck",
  "bro + wn",
  "f + ox",
  "jum + ps",
  "ov + er",
  "a + ",
  "la + zy",
  "d + og",
]);
