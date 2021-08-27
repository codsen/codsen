import tap from "tap";
import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

tap.test("01 - 1st argument missing", (t) => {
  t.throws(() => {
    isIndexWithin();
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - 1st and 2nd args swapped", (t) => {
  t.throws(() => {
    isIndexWithin([[1, 2]], 2);
  }, /THROW_ID_01/);
  t.end();
});
