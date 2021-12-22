import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

test("01 is not Jinja", () => {
  not.match(``, isJinjaSpecific(), "01.01");
  not.match(`\n`, isJinjaSpecific(), "01.02");
  not.match(`abc`, isJinjaSpecific(), "01.03");
  not.match(`<html><div></html>`, isJinjaSpecific(), "01.04");
});

test("02 maybe Jinja", () => {
  not.match(`{{ var1 }}`, isJinjaSpecific(), "02.01");
  not.match(`{% if something %}`, isJinjaSpecific(), "02.02");
});

test("03 namespaces", () => {
  match(`{% set x = namespace(blablabla) %}`, isJinjaSpecific(), "03");
});

test("04 backwards order", () => {
  match(`{{'oodles' if crambles else 'brambles'}}`, isJinjaSpecific(), "04");
});

test.run();
