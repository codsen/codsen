import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// alt attr is present, but without equal and double quotes.
// -----------------------------------------------------------------------------

tap.test("01 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img alt>zzz"),
    'zzz<img alt="" >zzz',
    "01 - html - tight"
  );
  t.end();
});

tap.test("02 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img    alt>zzz"),
    'zzz<img alt="" >zzz',
    "02 - html - excessive white space"
  );
  t.end();
});

tap.test("03 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img alt >zzz"),
    'zzz<img alt="" >zzz',
    "03 - html - one trailing space"
  );
  t.end();
});

tap.test("04 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img      alt      >zzz"),
    'zzz<img alt="" >zzz',
    "04 - html - excessive white space on both sides"
  );
  t.end();
});

tap.test("05 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img alt/>zzz"),
    'zzz<img alt="" />zzz',
    "05 - xhtml - tight"
  );
  t.end();
});

tap.test("06 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img alt />zzz"),
    'zzz<img alt="" />zzz',
    "06 - xhtml - single space on both sides"
  );
  t.end();
});

tap.test("07 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img      alt   />zzz"),
    'zzz<img alt="" />zzz',
    "07 - xhtml - excessive white space on both sides"
  );
  t.end();
});

tap.test("08 - alt without equal", (t) => {
  t.strictSame(
    alt("zzz<img      alt   /   >zzz"),
    'zzz<img alt="" />zzz',
    "08 - xhtml - excessive white space everywhere"
  );
  t.end();
});
