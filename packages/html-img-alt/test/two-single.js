import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// GROUP FIFTEEN.
// -----------------------------------------------------------------------------
// alt with two single quotes, HTML

tap.test("01 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt=''    >zzz"), 'zzz<img alt="" >zzz', "01");
  t.end();
});

tap.test("02 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =''    >zzz"), 'zzz<img alt="" >zzz', "02");
  t.end();
});

tap.test("03 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    ''    >zzz"),
    'zzz<img alt="" >zzz',
    "03"
  );
  t.end();
});

tap.test("04 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =    ''>zzz"), 'zzz<img alt="" >zzz', "04");
  t.end();
});

tap.test("05 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt='   '    >zzz"), 'zzz<img alt="" >zzz', "05");
  t.end();
});

tap.test("06 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    ='   '    >zzz"), 'zzz<img alt="" >zzz', "06");
  t.end();
});

tap.test("07 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    '   '    >zzz"),
    'zzz<img alt="" >zzz',
    "07"
  );
  t.end();
});

tap.test("08 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =    '   '>zzz"), 'zzz<img alt="" >zzz', "08");
  t.end();
});
