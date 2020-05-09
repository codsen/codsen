import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// weird code cases, all broken (X)HTML
// -----------------------------------------------------------------------------

tap.test(
  "01 - testing escape latch for missing second double quote cases",
  (t) => {
    // it kicks in when encounters equals sign after the first double quote
    // until we add function to recognise the attributes within IMG tags,
    // escape latch will kick in and prevent all action when second double quote is missing
    t.same(
      alt('zzz<img alt="  class="" />zzz'),
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
  t.same(alt("zzz<img >>>>>>>>>>zzz"), 'zzz<img alt="" >>>>>>>>>>zzz', "02.01");
  t.same(alt("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "02.02");
  t.same(
    alt("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "02.03"
  );
  t.end();
});

tap.test("03 - other attributes don't have equal and value", (t) => {
  t.same(
    alt('<img something alt="" >'),
    '<img something alt="" >',
    "03.01 - img tag only, with alt"
  );
  t.same(
    alt("<img something>"),
    '<img something alt="" >',
    "03.02 - img tag only, no alt"
  );
  t.same(
    alt("<img something >"),
    '<img something alt="" >',
    "03.03 - img tag only, no alt"
  );
  // XHTML counterparts:
  t.same(
    alt('<img something alt="" />'),
    '<img something alt="" />',
    "03.04 - img tag only, with alt"
  );
  t.same(
    alt("<img something/>"),
    '<img something alt="" />',
    "03.05 - img tag only, no alt, tight"
  );
  t.same(
    alt("<img something />"),
    '<img something alt="" />',
    "03.06 - img tag only, no alt"
  );
  t.same(
    alt('<img something alt="" /     >'),
    '<img something alt="" />',
    "03.07 - img tag only, with alt, excessive white space"
  );
  t.same(
    alt("<img something/     >"),
    '<img something alt="" />',
    "03.08 - img tag only, no alt, excessive white space"
  );
  t.same(
    alt("<img something /     >"),
    '<img something alt="" />',
    "03.09 - img tag only, no alt, excessive white space"
  );
  t.end();
});

tap.test(
  "04 - specific place in the algorithm, protection against rogue slashes",
  (t) => {
    t.same(
      alt('<img alt="/ class="" />'),
      '<img alt="/ class="" />',
      "04 - should do nothing."
    );
    t.end();
  }
);
