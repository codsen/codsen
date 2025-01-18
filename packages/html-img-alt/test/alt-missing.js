import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is missing
// -----------------------------------------------------------------------------

test("01 - missing alt", () => {
  equal(alts("zzz<img>zzz"), 'zzz<img alt="" >zzz', "01.01");
});

test("02 - missing alt", () => {
  equal(alts("zzz<img >zzz"), 'zzz<img alt="" >zzz', "02.01");
});

test("03 - missing alt", () => {
  equal(alts("zzz<img      >zzz"), 'zzz<img alt="" >zzz', "03.01");
});

test("04 - missing alt", () => {
  equal(alts("zzz<img/>zzz"), 'zzz<img alt="" />zzz', "04.01");
});

test("05 - missing alt", () => {
  equal(alts("zzz<img />zzz"), 'zzz<img alt="" />zzz', "05.01");
});

test("06 - missing alt", () => {
  equal(alts("zzz<img           />zzz"), 'zzz<img alt="" />zzz', "06.01");
});

test("07 - missing alt", () => {
  equal(alts("zzz<img           /    >zzz"), 'zzz<img alt="" />zzz', "07.01");
});

test.run();
