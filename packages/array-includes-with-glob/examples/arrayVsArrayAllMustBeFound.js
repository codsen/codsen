// `opts.arrayVsArrayAllMustBeFound`

import { strict as assert } from "node:assert";

import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

const source = ["aaa", "bbb", "ccc"];
const whatToLookFor = ["a*", "d*"];

// the default setting for opts.arrayVsArrayAllMustBeFound is "any"
assert.equal(includesWithGlob(source, whatToLookFor), true);
assert.equal(
  includesWithGlob(source, whatToLookFor, {
    arrayVsArrayAllMustBeFound: "any",
  }),
  true,
);
// true, because one element, 'a*' was found in source (it was its first element)

assert.equal(
  includesWithGlob(source, whatToLookFor, {
    arrayVsArrayAllMustBeFound: "all",
  }),
  false,
);
// false, because not all elements were found, the 'd*' is missing
