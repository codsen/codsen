import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// weird code cases, all broken (X)HTML
// -----------------------------------------------------------------------------

test("01 - testing escape latch for missing second double quote cases", () => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  equal(
    alts('zzz<img alt="  class="" />zzz'),
    'zzz<img alt="  class="" />zzz',
    "01.01"
  );
});

test("02 - testing seriously messed up code", () => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  equal(alts("zzz<img >>>>>>>>>>zzz"), 'zzz<img alt="" >>>>>>>>>>zzz', "02.01");
  equal(alts("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "02.02");
  equal(
    alts("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "02.03"
  );
});

test("03 - other attributes don't have equal and value", () => {
  equal(alts('<img something alt="" >'), '<img something alt="" >', "03.01");
  equal(alts("<img something>"), '<img something alt="" >', "03.02");
  equal(alts("<img something >"), '<img something alt="" >', "03.03");
  // XHTML counterparts:
  equal(alts('<img something alt="" />'), '<img something alt="" />', "03.04");
  equal(alts("<img something/>"), '<img something alt="" />', "03.05");
  equal(alts("<img something />"), '<img something alt="" />', "03.06");
  equal(
    alts('<img something alt="" /     >'),
    '<img something alt="" />',
    "03.07"
  );
  equal(alts("<img something/     >"), '<img something alt="" />', "03.08");
  equal(alts("<img something /     >"), '<img something alt="" />', "03.09");
});

test("04 - specific place in the algorithm, protection against rogue slashes", () => {
  equal(alts('<img alt="/ class="" />'), '<img alt="/ class="" />', "04.01");
});

test.run();
