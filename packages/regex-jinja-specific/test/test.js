import tap from "tap";
import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

tap.test("01 is not Jinja", (t) => {
  t.notMatch(``, isJinjaSpecific(), "01.01");
  t.notMatch(`\n`, isJinjaSpecific(), "01.02");
  t.notMatch(`abc`, isJinjaSpecific(), "01.03");
  t.notMatch(`<html><div></html>`, isJinjaSpecific(), "01.04");
  t.end();
});

tap.test("02 maybe Jinja", (t) => {
  t.notMatch(`{{ var1 }}`, isJinjaSpecific(), "02.01");
  t.notMatch(`{% if something %}`, isJinjaSpecific(), "02.02");
  t.end();
});

tap.test("03 namespaces", (t) => {
  t.match(`{% set x = namespace(blablabla) %}`, isJinjaSpecific(), "03");
  t.end();
});

tap.test("04 backwards order", (t) => {
  t.match(`{{'oodles' if crambles else 'brambles'}}`, isJinjaSpecific(), "04");
  t.end();
});
