import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// alt with only one single quote
// -----------------------------------------------------------------------------

test("01 - alt with only one single quote", () => {
  equal(alts("zzz<img alt='>zzz"), 'zzz<img alt="" >zzz', "01.01");
});

test("02 - alt with only one single quote", () => {
  equal(alts("zzz<img alt=  '  >zzz"), 'zzz<img alt="" >zzz', "02.01");
});

test("03 - alt with only one single quote", () => {
  equal(alts("zzz<img alt   =  '  >zzz"), 'zzz<img alt="" >zzz', "03.01");
});

test("04 - alt with only one single quote", () => {
  equal(
    alts("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "04.01",
  );
});

test("05 - alt with only one single quote", () => {
  equal(alts("zzz<img alt=  ''  >zzz"), 'zzz<img alt="" >zzz', "05.01");
});

test("06 - alt with only one single quote", () => {
  equal(alts("zzz<img alt=  ''>zzz"), 'zzz<img alt="" >zzz', "06.01");
});

test("07 - alt with only one single quote", () => {
  equal(alts("zzz<img alt    ='>zzz"), 'zzz<img alt="" >zzz', "07.01");
});

test.run();
