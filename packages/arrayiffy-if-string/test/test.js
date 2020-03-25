const t = require("tap");
const a = require("../dist/arrayiffy-if-string.cjs");

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

t.test("01.01 - string input", (t) => {
  t.same(a("aaa"), ["aaa"], "01.01.01");
  t.same(a(""), [], "01.01.02");
  t.end();
});

t.test("01.02 - non-string input", (t) => {
  t.same(a(1), 1, "01.02.01");
  t.same(a(null), null, "01.02.02");
  t.same(a(undefined), undefined, "01.02.03");
  t.same(a(), undefined, "01.02.04");
  t.same(a(true), true, "01.02.05");
  t.end();
});
