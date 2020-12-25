import tap from "tap";
import { unfancy } from "../dist/string-unfancy.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong/missing input = throw", (t) => {
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

tap.test("02 - unfancies fancy strings", (t) => {
  t.strictSame(unfancy("“zzz”"), '"zzz"', "02");
  t.end();
});

tap.test("03 - copes with encoded HTML chars that happen to be fancy", (t) => {
  t.strictSame(unfancy("zzz&rsquo;zzz"), "zzz'zzz", "03");
  t.end();
});

tap.test("04 - fancies with triple-encoded HTML", (t) => {
  t.strictSame(unfancy("zzz&amp;amp;rsquo;zzz"), "zzz'zzz", "04");
  t.end();
});

tap.test("05 - removes non-breaking spaces", (t) => {
  t.strictSame(unfancy("aaaa&nbsp;&ndash; bbbb"), "aaaa - bbbb", "05.01");
  t.strictSame(unfancy("aaaa\u00A0\u2013 bbbb"), "aaaa - bbbb", "05.02");
  t.end();
});
