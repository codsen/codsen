import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt with two double quotes, excessive whitespace, HTML
// -----------------------------------------------------------------------------

test("01 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(alts('zzz<img     alt=""    >zzz'), 'zzz<img alt="" >zzz', "01.01");
});

test("02 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(alts('zzz<img     alt    =""    >zzz'), 'zzz<img alt="" >zzz', "02.01");
});

test("03 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(
    alts('zzz<img     alt    =    ""    >zzz'),
    'zzz<img alt="" >zzz',
    "03.01",
  );
});

test("04 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(alts('zzz<img     alt    =    "">zzz'), 'zzz<img alt="" >zzz', "04.01");
});

test("05 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(alts('zzz<img     alt="   "    >zzz'), 'zzz<img alt="" >zzz', "05.01");
});

test("06 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(
    alts('zzz<img     alt    ="   "    >zzz'),
    'zzz<img alt="" >zzz',
    "06.01",
  );
});

test("07 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(
    alts('zzz<img     alt    =    "   "    >zzz'),
    'zzz<img alt="" >zzz',
    "07.01",
  );
});

test("08 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(
    alts('zzz<img     alt    =    "   ">zzz'),
    'zzz<img alt="" >zzz',
    "08.01",
  );
});

test("09 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", () => {
  equal(
    alts('zzz<img     alt    =    "   ">zzz'),
    'zzz<img alt="" >zzz',
    "09.01",
  );
});

test("10 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt=""    >zzz<img     alt=""    >zzz<img     alt=""    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "10.01",
  );
});

test("11 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =""    >zzz<img     alt    =""    >zzz<img     alt    =""    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.01",
  );
});

test("12 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "12.01",
  );
});

test("13 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =    "">zzz<img     alt    =    "">zzz<img     alt    =    "">zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "13.01",
  );
});

test("14 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt="   "    >zzz<img     alt="   "    >zzz<img     alt="   "    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "14.01",
  );
});

test("15 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "15.01",
  );
});

test("16 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "16.01",
  );
});

test("17 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "17.01",
  );
});

test("18 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", () => {
  equal(
    alts(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz',
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "18.01",
  );
});

test.run();
