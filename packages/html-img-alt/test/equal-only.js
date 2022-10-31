import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt attr is present, but with only equal character
// -----------------------------------------------------------------------------

test("01 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz',
    "01.01 - html, no space after"
  );
});

test("02 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=>zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz<img alt="" >zzz',
    "02.01 - html, two imag tags, no space after each"
  );
});

test("03 - alt with just equal", () => {
  equal(
    alts("zzz<img alt= >zzz"),
    'zzz<img alt="" >zzz',
    "03.01 - html, space after"
  );
});

test("04 - alt with just equal", () => {
  equal(
    alts("zzz<img    alt=>zzz"),
    'zzz<img alt="" >zzz',
    "04.01 - html, excessive space in front"
  );
});

test("05 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=    >zzz"),
    'zzz<img alt="" >zzz',
    "05.01 - html, excessive space after"
  );
});

test("06 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "06.01 - xhtml, no space after"
  );
});

test("07 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=/   >zzz"),
    'zzz<img alt="" />zzz',
    "07.01 - xhtml, no space after"
  );
});

test("08 - alt with just equal", () => {
  equal(
    alts("zzz<img alt= />zzz"),
    'zzz<img alt="" />zzz',
    "08.01 - xhtml, space after"
  );
});

test("09 - alt with just equal", () => {
  equal(
    alts("zzz<img    alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "09.01 - xhtml, excessive space before"
  );
});

test("10 - alt with just equal", () => {
  equal(
    alts("zzz<img alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "10.01 - xhtml, excessive space after"
  );
});

test("11 - alt with just equal", () => {
  equal(
    alts("zzz<img     alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "11.01 - xhtml, excessive space on both sides of alt="
  );
});

test("12 - alt with just equal", () => {
  equal(
    alts("zzz<img     alt   =    />zzz"),
    'zzz<img alt="" />zzz',
    "12.01 - xhtml, excessive space on both sides of equal, no quotes"
  );
});

test("13 - alt with just equal", () => {
  equal(
    alts("zzz<img alt    =>zzz"),
    'zzz<img alt="" >zzz',
    "13.01 - html, no space after"
  );
});

test("14 - alt with just equal", () => {
  equal(
    alts('zzz<img alt    =   "">zzz'),
    'zzz<img alt="" >zzz',
    "14.01 - html, no space after"
  );
});

test.run();
