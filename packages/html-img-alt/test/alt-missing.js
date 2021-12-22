import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is missing
// -----------------------------------------------------------------------------

test("01 - missing alt", () => {
  equal(alts("zzz<img>zzz"), 'zzz<img alt="" >zzz', "01 - html - tight");
});

test("02 - missing alt", () => {
  equal(
    alts("zzz<img >zzz"),
    'zzz<img alt="" >zzz',
    "02 - html - trailing space"
  );
});

test("03 - missing alt", () => {
  equal(
    alts("zzz<img      >zzz"),
    'zzz<img alt="" >zzz',
    "03 - html - excessive trailing space"
  );
});

test("04 - missing alt", () => {
  equal(alts("zzz<img/>zzz"), 'zzz<img alt="" />zzz', "04 - xhtml - tight");
});

test("05 - missing alt", () => {
  equal(
    alts("zzz<img />zzz"),
    'zzz<img alt="" />zzz',
    "05 - xhtml - one space before slash"
  );
});

test("06 - missing alt", () => {
  equal(
    alts("zzz<img           />zzz"),
    'zzz<img alt="" />zzz',
    "06 - xhtml - many spaces before slash"
  );
});

test("07 - missing alt", () => {
  equal(
    alts("zzz<img           /    >zzz"),
    'zzz<img alt="" />zzz',
    "07 - xhtml - many spaces on both sides"
  );
});

test.run();
