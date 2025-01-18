import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is present, but without equal and double quotes.
// -----------------------------------------------------------------------------

test("01 - alt without equal", () => {
  equal(alts("zzz<img alt>zzz"), 'zzz<img alt="" >zzz', "01.01");
});

test("02 - alt without equal", () => {
  equal(alts("zzz<img    alt>zzz"), 'zzz<img alt="" >zzz', "02.01");
});

test("03 - alt without equal", () => {
  equal(alts("zzz<img alt >zzz"), 'zzz<img alt="" >zzz', "03.01");
});

test("04 - alt without equal", () => {
  equal(alts("zzz<img      alt      >zzz"), 'zzz<img alt="" >zzz', "04.01");
});

test("05 - alt without equal", () => {
  equal(alts("zzz<img alt/>zzz"), 'zzz<img alt="" />zzz', "05.01");
});

test("06 - alt without equal", () => {
  equal(alts("zzz<img alt />zzz"), 'zzz<img alt="" />zzz', "06.01");
});

test("07 - alt without equal", () => {
  equal(alts("zzz<img      alt   />zzz"), 'zzz<img alt="" />zzz', "07.01");
});

test("08 - alt without equal", () => {
  equal(alts("zzz<img      alt   /   >zzz"), 'zzz<img alt="" />zzz', "08.01");
});

test.run();
