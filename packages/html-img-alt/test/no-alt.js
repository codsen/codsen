import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// no alt attr is missing, only whitespace control
// -----------------------------------------------------------------------------

test("01 - nothing is missing", () => {
  equal(
    alts('zzz<img        alt="123" >zzz'),
    'zzz<img alt="123" >zzz',
    "01.01"
  );
});

test("02 - nothing is missing", () => {
  equal(alts('<img   alt="123"    >'), '<img alt="123" >', "02.01");
});

test("03 - nothing is missing", () => {
  equal(
    alts('xxx<img        alt="123" >yyy<img   alt="123"    >zzz'),
    'xxx<img alt="123" >yyy<img alt="123" >zzz',
    "03.01"
  );
});

test("04 - nothing is missing", () => {
  equal(
    alts('zzz<img        alt="123" />zzz'),
    'zzz<img alt="123" />zzz',
    "04.01"
  );
});

test("05 - nothing is missing", () => {
  equal(
    alts('xxx<img        alt="123" />yyy<img   alt="123"    />zzz'),
    'xxx<img alt="123" />yyy<img alt="123" />zzz',
    "05.01"
  );
});

test("06 - nothing is missing", () => {
  equal(alts("aaaa        bbbbb"), "aaaa        bbbbb", "06.01");
});

test("07 - nothing is missing", () => {
  equal(alts("aaaa alt bbbbb"), "aaaa alt bbbbb", "07.01");
});

test("08 - nothing is missing", () => {
  equal(alts("aaaa alt= bbbbb"), "aaaa alt= bbbbb", "08.01");
});

test("09 - nothing is missing", () => {
  equal(alts("aaaa alt = bbbbb"), "aaaa alt = bbbbb", "09.01");
});

test("10 - nothing is missing", () => {
  equal(alts('<img alt="1   23" >'), '<img alt="1   23" >', "10.01");
});

test("11 - nothing is missing", () => {
  equal(
    alts('<img    class="zzz"   alt="123"    >'),
    '<img class="zzz" alt="123" >',
    "11.01"
  );
});

test("12 - nothing is missing", () => {
  equal(
    alts('zzz<img        alt="123"    /  >yyy'),
    'zzz<img alt="123" />yyy',
    "12.01"
  );
});

test("13 - nothing is missing", () => {
  equal(
    alts('z/zz<img        alt="/123/"    /  >y/yy'),
    'z/zz<img alt="/123/" />y/yy',
    "13.01"
  );
});

test("14 - nothing is missing", () => {
  equal(
    alts('zzz<img     alt    =     ""    /     >zzz'),
    'zzz<img alt="" />zzz',
    "14.01"
  );
});

test("15 - nothing is missing", () => {
  equal(
    alts('zzz<img        alt="123"   class="test" >zzz'),
    'zzz<img alt="123" class="test" >zzz',
    "15.01"
  );
});

test.run();
