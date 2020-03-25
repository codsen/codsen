const t = require("tap");
const unfancy = require("../dist/string-unfancy.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    unfancy();
  }, /THROW_ID_01/g);
  t.throws(() => {
    unfancy(1);
  }, /THROW_ID_02/g);
  t.throws(() => {
    unfancy(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    unfancy(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    unfancy(true);
  }, /THROW_ID_02/g);

  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test("02.01 - unfancies fancy strings", (t) => {
  t.same(unfancy("“zzz”"), '"zzz"', "02.01");
  t.end();
});

t.test("02.02 - copes with encoded HTML chars that happen to be fancy", (t) => {
  t.same(unfancy("zzz&rsquo;zzz"), "zzz'zzz", "02.02");
  t.end();
});

t.test("02.03 - fancies with triple-encoded HTML", (t) => {
  t.same(unfancy("zzz&amp;amp;rsquo;zzz"), "zzz'zzz", "02.03");
  t.end();
});

t.test("02.04 - removes non-breaking spaces", (t) => {
  t.same(unfancy("aaaa&nbsp;&ndash; bbbb"), "aaaa - bbbb", "02.04.01");
  t.same(unfancy("aaaa\u00A0\u2013 bbbb"), "aaaa - bbbb", "02.04.02");
  t.end();
});
