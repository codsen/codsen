import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is present, but with only equal character
// -----------------------------------------------------------------------------

test("01 - alt with just equal", () => {
  equal(alts("zzz<img alt=>zzz"), 'zzz<img alt="" >zzz', "01.01");
});

test("02 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=>zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz<img alt="" >zzz',
    "02.01",
  );
});

test("03 - alt with just equal", () => {
  equal(alts("zzz<img alt= >zzz"), 'zzz<img alt="" >zzz', "03.01");
});

test("04 - alt with just equal", () => {
  equal(alts("zzz<img    alt=>zzz"), 'zzz<img alt="" >zzz', "04.01");
});

test("05 - alt with just equal", () => {
  equal(alts("zzz<img alt=    >zzz"), 'zzz<img alt="" >zzz', "05.01");
});

test("06 - alt with just equal", () => {
  equal(alts("zzz<img alt=/>zzz"), 'zzz<img alt="" />zzz', "06.01");
});

test("07 - alt with just equal", () => {
  equal(alts("zzz<img alt=/   >zzz"), 'zzz<img alt="" />zzz', "07.01");
});

test("08 - alt with just equal", () => {
  equal(alts("zzz<img alt= />zzz"), 'zzz<img alt="" />zzz', "08.01");
});

test("09 - alt with just equal", () => {
  equal(alts("zzz<img    alt=/>zzz"), 'zzz<img alt="" />zzz', "09.01");
});

test("10 - alt with just equal", () => {
  equal(alts("zzz<img alt=    />zzz"), 'zzz<img alt="" />zzz', "10.01");
});

test("11 - alt with just equal", () => {
  equal(alts("zzz<img     alt=    />zzz"), 'zzz<img alt="" />zzz', "11.01");
});

test("12 - alt with just equal", () => {
  equal(alts("zzz<img     alt   =    />zzz"), 'zzz<img alt="" />zzz', "12.01");
});

test("13 - alt with just equal", () => {
  equal(alts("zzz<img alt    =>zzz"), 'zzz<img alt="" >zzz', "13.01");
});

test("14 - alt with just equal", () => {
  equal(alts('zzz<img alt    =   "">zzz'), 'zzz<img alt="" >zzz', "14.01");
});

test.run();
