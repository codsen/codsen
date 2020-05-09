import tap from "tap";
import compare from "../dist/ast-compare.esm";

// api tests
// -----------------------------------------------------------------------------

tap.test("01 - fourth argument doesn't break anything", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, true),
    false,
    "01.01"
  );
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, false),
    false,
    "01.02"
  );
  t.end();
});
