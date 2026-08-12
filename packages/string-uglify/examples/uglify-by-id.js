// Uglify one name by its array index

import { strict as assert } from "node:assert";

import { uglifyById } from "../dist/string-uglify.esm.js";

const names = [
  ".module-promo-all",
  ".module-promo-main",
  ".module-promo-second",
  "#zzz",
];

assert.equal(uglifyById(names, 3), "#l");
