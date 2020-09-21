import tap from "tap";
import wthn from "../dist/ranges-is-index-within.esm";

tap.test("01 - 1st argument missing", (t) => {
  t.throws(() => {
    wthn();
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - 1st and 2nd args swapped", (t) => {
  t.throws(() => {
    wthn([[1, 2]], 2);
  }, /THROW_ID_01/);
  t.end();
});
