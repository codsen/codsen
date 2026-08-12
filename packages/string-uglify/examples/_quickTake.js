// Quick Take

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

// notice we put dots and hashes for classes and id's but algorithm will work
// fine too if you won't.
const names = [
  ".module-promo-all",
  ".module-promo-main",
  ".module-promo-second",
  "#zzz",
];

assert.deepEqual(uglifyArr(names), [".o", ".s", ".z", "#l"]);
