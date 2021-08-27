import tap from "tap";
import { alts } from "../dist/html-img-alt.esm.js";

// weird code cases, all broken (X)HTML
// -----------------------------------------------------------------------------

tap.test(
  "01 - testing escape latch for missing second double quote cases",
  (t) => {
    // it kicks in when encounters equals sign after the first double quote
    // until we add function to recognise the attributes within IMG tags,
    // escape latch will kick in and prevent all action when second double quote is missing
    t.strictSame(
      alts('zzz<img alt="  class="" />zzz'),
      'zzz<img alt="  class="" />zzz',
      "01"
    );
    t.end();
  }
);

tap.test("02 - testing seriously messed up code", (t) => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.strictSame(
    alts("zzz<img >>>>>>>>>>zzz"),
    'zzz<img alt="" >>>>>>>>>>zzz',
    "02.01"
  );
  t.strictSame(alts("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "02.02");
  t.strictSame(
    alts("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "02.03"
  );
  t.end();
});

tap.test("03 - other attributes don't have equal and value", (t) => {
  t.strictSame(
    alts('<img something alt="" >'),
    '<img something alt="" >',
    "03.01 - img tag only, with alt"
  );
  t.strictSame(
    alts("<img something>"),
    '<img something alt="" >',
    "03.02 - img tag only, no alt"
  );
  t.strictSame(
    alts("<img something >"),
    '<img something alt="" >',
    "03.03 - img tag only, no alt"
  );
  // XHTML counterparts:
  t.strictSame(
    alts('<img something alt="" />'),
    '<img something alt="" />',
    "03.04 - img tag only, with alt"
  );
  t.strictSame(
    alts("<img something/>"),
    '<img something alt="" />',
    "03.05 - img tag only, no alt, tight"
  );
  t.strictSame(
    alts("<img something />"),
    '<img something alt="" />',
    "03.06 - img tag only, no alt"
  );
  t.strictSame(
    alts('<img something alt="" /     >'),
    '<img something alt="" />',
    "03.07 - img tag only, with alt, excessive white space"
  );
  t.strictSame(
    alts("<img something/     >"),
    '<img something alt="" />',
    "03.08 - img tag only, no alt, excessive white space"
  );
  t.strictSame(
    alts("<img something /     >"),
    '<img something alt="" />',
    "03.09 - img tag only, no alt, excessive white space"
  );
  t.end();
});

tap.test(
  "04 - specific place in the algorithm, protection against rogue slashes",
  (t) => {
    t.strictSame(
      alts('<img alt="/ class="" />'),
      '<img alt="/ class="" />',
      "04 - should do nothing."
    );
    t.end();
  }
);
