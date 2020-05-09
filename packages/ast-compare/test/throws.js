import tap from "tap";
import compare from "../dist/ast-compare.esm";

// throws
// -----------------------------------------------------------------------------

tap.test("01 - both inputs missing", (t) => {
  t.throws(() => {
    compare();
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("02 - second input missing", (t) => {
  t.throws(() => {
    compare({ a: "a" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    compare({ a: "a" }, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("03 - first input missing", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04 - null as input", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("05 - falsey inputs", (t) => {
  t.throws(() => {
    compare(null, undefined);
  }, /THROW_ID_02/g);
  t.throws(() => {
    compare(null, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_02/g);
  t.end();
});
