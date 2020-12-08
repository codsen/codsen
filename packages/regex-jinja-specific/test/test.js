import tap from "tap";
import r from "../dist/regex-jinja-specific.esm";

tap.test("01 is not Jinja", (t) => {
  t.notMatch(``, r(), "01.01");
  t.notMatch(`\n`, r(), "01.02");
  t.notMatch(`abc`, r(), "01.03");
  t.notMatch(`<html><div></html>`, r(), "01.04");
  t.end();
});

tap.test("02 maybe Jinja", (t) => {
  t.notMatch(`{{ var1 }}`, r(), "02.01");
  t.notMatch(`{% if something %}`, r(), "02.02");
  t.end();
});

tap.test("03 namespaces", (t) => {
  t.match(`{% set x = namespace(blablabla) %}`, r(), "03");
  t.end();
});

tap.test("04 backwards order", (t) => {
  t.match(`{{'oodles' if crambles else 'brambles'}}`, r(), "04");
  t.end();
});
