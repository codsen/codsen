import tap from "tap";
import a from "../dist/arrayiffy-if-string.esm";

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

tap.test("01 - string input", (t) => {
  t.same(a("aaa"), ["aaa"], "01.01");
  t.same(a(""), [], "01.02");
  t.end();
});

tap.test("02 - non-string input", (t) => {
  t.same(a(1), 1, "02.01");
  t.same(a(null), null, "02.02");
  t.same(a(undefined), undefined, "02.03");
  t.same(a(), undefined, "02.04");
  t.same(a(true), true, "02.05");
  t.end();
});
