import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is present, but with only one quote (double or single), one tag
// -----------------------------------------------------------------------------

test("01 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt=">zzz'), 'zzz<img alt="" >zzz', "01");
});

test("02 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt =">zzz'), 'zzz<img alt="" >zzz', "02");
});

test("03 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt= ">zzz'), 'zzz<img alt="" >zzz', "03");
});

test("04 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt=" >zzz'), 'zzz<img alt="" >zzz', "04");
});

test("05 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt   =">zzz'), 'zzz<img alt="" >zzz', "05");
});

test("06 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt=   ">zzz'), 'zzz<img alt="" >zzz', "06");
});

test("07 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt="   >zzz'), 'zzz<img alt="" >zzz', "07");
});

test("08 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt   =   ">zzz'), 'zzz<img alt="" >zzz', "08");
});

test("09 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt=   "   >zzz'), 'zzz<img alt="" >zzz', "09");
});

test("10 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt   ="   >zzz'), 'zzz<img alt="" >zzz', "10");
});

test("11 - alt with only one double quote, one HTML tag", () => {
  equal(alts('zzz<img alt   =   "   >zzz'), 'zzz<img alt="" >zzz', "11");
});

test("12 - alt with only one double quote, one HTML tag", () => {
  equal(
    alts('<img alt="legit quote: \'" >'),
    '<img alt="legit quote: \'" >',
    "12"
  );
});

test.run();
