import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(false);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("03 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(null);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("04 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(1);
  }, /THROW_ID_01/);
  t.end();
});

// wrong opts
// -----------------------------------------------------------------------------

tap.test("05 - wrong opts", (t) => {
  t.throws(() => {
    stripHtml("zzz", 1);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("06 - wrong opts", (t) => {
  t.throws(() => {
    stripHtml("zzz", true);
  }, /THROW_ID_02/);
  t.end();
});

// legit input
// -----------------------------------------------------------------------------

tap.test("07 - empty input", (t) => {
  t.same(stripHtml(""), "", "07");
  t.end();
});

tap.test("08 - whitespace only", (t) => {
  t.same(stripHtml("\t\t\t"), "\t\t\t", "08");
  t.end();
});
