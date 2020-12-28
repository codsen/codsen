// Quick Take

import { strict as assert } from "assert";
import { findMalformed } from "../dist/string-find-malformed.esm.js";

// Below, we look for dodgy cases of `<!--`
const gathered = [];
findMalformed(
  "<div><!-something--></div>",
  "<!--",
  // your callback function:
  (obj) => {
    gathered.push(obj);
  },
  {
    maxDistance: 1, // Levenshtein distance
  }
);
assert.deepEqual(gathered, [
  {
    idxFrom: 5,
    idxTo: 8,
  },
]);
