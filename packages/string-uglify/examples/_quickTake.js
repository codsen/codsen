/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import { uglifyById, uglifyArr, version } from "../dist/string-uglify.esm.js";

// notice we put dots and hashes for classes and id's but algorithm will work
// fine too if you won't.
const names = [
  ".module-promo-all",
  ".module-promo-main",
  ".module-promo-second",
  "#zzz",
];

// notice we put dots and hashes for classes and id's but algorithm will work
// fine too if you won't.
assert.deepEqual(uglifyArr(names), [".o", ".s", ".z", "#l"]);

// uglify a particular id number (inefficient):
assert.equal(uglifyById(names, 3), "#l");
