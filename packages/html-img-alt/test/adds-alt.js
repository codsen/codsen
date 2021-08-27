import tap from "tap";
import { alts } from "../dist/html-img-alt.esm.js";

// adds ALT
// -----------------------------------------------------------------------------

tap.test("01 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    "01 - html simples"
  );
  t.end();
});

tap.test("02 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    "02 - xhtml simples"
  );
  t.end();
});

tap.test("03 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    "03 - xhtml simples"
  );
  t.end();
});

tap.test("04 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    "04 - xhtml simples"
  );
  t.end();
});

tap.test("05 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    "05 - html advanced"
  );
  t.end();
});

tap.test("06 - normalising all attributes on IMG, adding ALT", (t) => {
  t.strictSame(
    alts(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    "06 - xhtml advanced"
  );
  t.end();
});
