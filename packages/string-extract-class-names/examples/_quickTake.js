// Quick Take

import { strict as assert } from "assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

// extracts classes and/or id's
const str = "div#brambles.nushes#croodles";
const { res, ranges } = extract(str);
assert.deepEqual(res, ["#brambles", ".nushes", "#croodles"]);
assert.deepEqual(ranges, [
  [3, 12],
  [12, 19],
  [19, 28],
]);

// `res` can be produced by slicing `ranges`:
assert.deepEqual(
  res,
  ranges.map(([from, to]) => str.slice(from, to)),
);
