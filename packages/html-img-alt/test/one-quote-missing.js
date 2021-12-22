import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt with only one single quote
// -----------------------------------------------------------------------------

test("01 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt='>zzz"),
    'zzz<img alt="" >zzz',
    "01 - html, one single quote"
  );
});

test("02 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt=  '  >zzz"),
    'zzz<img alt="" >zzz',
    "02 - html, one single quote"
  );
});

test("03 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt   =  '  >zzz"),
    'zzz<img alt="" >zzz',
    "03 - html, one single quote"
  );
});

test("04 - alt with only one single quote", () => {
  equal(
    alts("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "04 - html, one single quote"
  );
});

test("05 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt=  ''  >zzz"),
    'zzz<img alt="" >zzz',
    "05 - html, two single quotes"
  );
});

test("06 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt=  ''>zzz"),
    'zzz<img alt="" >zzz',
    "06 - html, two single quotes"
  );
});

test("07 - alt with only one single quote", () => {
  equal(
    alts("zzz<img alt    ='>zzz"),
    'zzz<img alt="" >zzz',
    "07 - html, one single quote"
  );
});

test.run();
