// Inspect the source ranges of extracted selectors

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

const source = "div#brambles.nushes#croodles";
const { res, ranges } = extract(source);

assert.deepEqual(ranges, [
  [3, 12],
  [12, 19],
  [19, 28],
]);

assert.equal(
  ranges.map(([from, to]) => source.slice(from, to)).join("|"),
  res.join("|"),
);
