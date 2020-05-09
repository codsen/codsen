import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// alt with only one single quote
// -----------------------------------------------------------------------------

tap.test("01 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt='>zzz"),
    'zzz<img alt="" >zzz',
    "01 - html, one single quote"
  );
  t.end();
});

tap.test("02 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  '  >zzz"),
    'zzz<img alt="" >zzz',
    "02 - html, one single quote"
  );
  t.end();
});

tap.test("03 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt   =  '  >zzz"),
    'zzz<img alt="" >zzz',
    "03 - html, one single quote"
  );
  t.end();
});

tap.test("04 - alt with only one single quote", (t) => {
  t.same(
    alt("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "04 - html, one single quote"
  );
  t.end();
});

tap.test("05 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''  >zzz"),
    'zzz<img alt="" >zzz',
    "05 - html, two single quotes"
  );
  t.end();
});

tap.test("06 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''>zzz"),
    'zzz<img alt="" >zzz',
    "06 - html, two single quotes"
  );
  t.end();
});

tap.test("07 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt    ='>zzz"),
    'zzz<img alt="" >zzz',
    "07 - html, one single quote"
  );
  t.end();
});
