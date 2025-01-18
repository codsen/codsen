import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// adds ALT
// -----------------------------------------------------------------------------

test("01 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    "01.01",
  );
});

test("02 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    "02.01",
  );
});

test("03 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    "03.01",
  );
});

test("04 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    "04.01",
  );
});

test("05 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz',
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    "05.01",
  );
});

test("06 - normalising all attributes on IMG, adding ALT", () => {
  equal(
    alts(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz',
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    "06.01",
  );
});

test.run();
