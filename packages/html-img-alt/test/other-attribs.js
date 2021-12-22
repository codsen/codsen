import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// missing ALT, other attributes present
// -----------------------------------------------------------------------------

test("01 - alt attribute is missing, there are other attributes too - HTML - #1", () => {
  // HTML
  equal(alts('zzz<img class="">zzz'), 'zzz<img class="" alt="" >zzz', "01");
});

test("02 - alt attribute is missing, there are other attributes too - HTML - #2", () => {
  equal(alts('zzz<img    class="">zzz'), 'zzz<img class="" alt="" >zzz', "02");
});

test("03 - alt attribute is missing, there are other attributes too - HTML - #3", () => {
  equal(
    alts('zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'),
    'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
    "03"
  );
});

test("04 - alt attribute is missing, there are other attributes too - XHTML - #1", () => {
  // XHTML
  equal(alts('zzz<img class=""/>zzz'), 'zzz<img class="" alt="" />zzz', "04");
});

test("05 - alt attribute is missing, there are other attributes too - XHTML - #1", () => {
  equal(
    alts('zzz<img    class=""/>zzz'),
    'zzz<img class="" alt="" />zzz',
    "05"
  );
});

test("06 - alt attribute is missing, there are other attributes too - XHTML - #2", () => {
  equal(
    alts('zzz<img class=""    />zzz'),
    'zzz<img class="" alt="" />zzz',
    "06"
  );
});

test("07 - alt attribute is missing, there are other attributes too - XHTML - #3", () => {
  equal(
    alts('zzz<img    class=""   />zzz'),
    'zzz<img class="" alt="" />zzz',
    "07"
  );
});

test("08 - alt attribute is missing, there are other attributes too - XHTML - #4", () => {
  equal(
    alts(
      'zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'
    ),
    'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    "08"
  );
});

test("09 - alt attribute is missing, there are other attributes too - XHTML - #5", () => {
  equal(
    alts('zzz<img class=""/   >zzz'),
    'zzz<img class="" alt="" />zzz',
    "09"
  );
});

test("10 - alt attribute is missing, there are other attributes too - XHTML - #6", () => {
  equal(
    alts('zzz<img    class=""/   >zzz'),
    'zzz<img class="" alt="" />zzz',
    "10"
  );
});

test("11 - alt attribute is missing, there are other attributes too - XHTML - #7", () => {
  equal(
    alts(
      'zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'
    ),
    'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    "11"
  );
});

test.run();
