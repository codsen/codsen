import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// alt attr is present, but with only one quote (double or single), 3 tags
// -----------------------------------------------------------------------------

tap.test("01 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=">zzz<img alt=">zzz<img alt=">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "01"
  );
  t.end();
});

tap.test("02 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt =">zzz<img alt =">zzz<img alt =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "02"
  );
  t.end();
});

tap.test("03 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt= ">zzz<img alt= ">zzz<img alt= ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "03"
  );
  t.end();
});

tap.test("04 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=" >zzz<img alt=" >zzz<img alt=" >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "04"
  );
  t.end();
});

tap.test("05 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =">zzz<img alt   =">zzz<img alt   =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "05"
  );
  t.end();
});

tap.test("06 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   ">zzz<img alt=   ">zzz<img alt=   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "06"
  );
  t.end();
});

tap.test("07 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt="   >zzz<img alt="   >zzz<img alt="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07"
  );
  t.end();
});

tap.test("08 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =   ">zzz<img alt   =   ">zzz<img alt   =   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "08"
  );
  t.end();
});

tap.test("09 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   "   >zzz<img alt=   "   >zzz<img alt=   "   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "09"
  );
  t.end();
});

tap.test("10 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   ="   >zzz<img alt   ="   >zzz<img alt   ="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "10"
  );
  t.end();
});

tap.test("11 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      'zzz<img alt   =   "   >zzz<img alt   =   "   >zzz<img alt   =   "   >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11"
  );
  t.end();
});

tap.test("12 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >'
    ),
    '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >',
    "12"
  );
  t.end();
});
