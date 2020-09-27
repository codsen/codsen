import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// alt attr is missing
// -----------------------------------------------------------------------------

tap.test("01 - missing alt", (t) => {
  t.strictSame(alt("zzz<img>zzz"), 'zzz<img alt="" >zzz', "01 - html - tight");
  t.end();
});

tap.test("02 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img >zzz"),
    'zzz<img alt="" >zzz',
    "02 - html - trailing space"
  );
  t.end();
});

tap.test("03 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img      >zzz"),
    'zzz<img alt="" >zzz',
    "03 - html - excessive trailing space"
  );
  t.end();
});

tap.test("04 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img/>zzz"),
    'zzz<img alt="" />zzz',
    "04 - xhtml - tight"
  );
  t.end();
});

tap.test("05 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img />zzz"),
    'zzz<img alt="" />zzz',
    "05 - xhtml - one space before slash"
  );
  t.end();
});

tap.test("06 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img           />zzz"),
    'zzz<img alt="" />zzz',
    "06 - xhtml - many spaces before slash"
  );
  t.end();
});

tap.test("07 - missing alt", (t) => {
  t.strictSame(
    alt("zzz<img           /    >zzz"),
    'zzz<img alt="" />zzz',
    "07 - xhtml - many spaces on both sides"
  );
  t.end();
});
