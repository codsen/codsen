import { test } from "uvu";
import { equal } from "uvu/assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

test("01 - an embedded set keyword is not a namespace assignment", () => {
  equal(isJinjaSpecific().test("{% asset x = namespace() %}"), false, "01.01");
  equal(isJinjaSpecific().test("{% offset x = namespace() %}"), false, "01.02");
});

test("02 - the set keyword requires whitespace before its identifier", () => {
  equal(isJinjaSpecific().test("{% setx=namespace() %}"), false, "02.01");
  equal(isJinjaSpecific().test("{% setx = namespace() %}"), false, "02.02");
});

test("03 - namespace assignments accept spaces, tabs and newlines", () => {
  equal(isJinjaSpecific().test("{% set x = namespace() %}"), true, "03.01");
  equal(isJinjaSpecific().test("{% set\tx = namespace() %}"), true, "03.02");
  equal(isJinjaSpecific().test("{% set\nx = namespace() %}"), true, "03.03");
});

test("04 - whitespace control preserves namespace assignment detection", () => {
  equal(
    isJinjaSpecific().test("{%- set ns = namespace(total=0) -%}"),
    true,
    "04.01",
  );
  equal(
    isJinjaSpecific().test("{%-set\tns=namespace(total=0)-%}"),
    true,
    "04.02",
  );
});

test("05 - a long identifier containing set is not a namespace assignment", () => {
  const identifier = "set".repeat(16_000);
  equal(isJinjaSpecific().test(`{{ ${identifier} }}`), false, "05.01");
});

test("06 - incomplete namespace assignments do not match", () => {
  equal(isJinjaSpecific().test("{% set item namespace() %}"), false, "06.01");
  equal(isJinjaSpecific().test("{% set item = namespac() %}"), false, "06.02");
});

test("07 - each factory call returns an independent global matcher", () => {
  const first = isJinjaSpecific();
  const input = "{% set one = namespace() %}{% set two = namespace() %}";
  equal(first.test(input), true, "07.01");
  const second = isJinjaSpecific();
  equal(first === second, false, "07.02");
  equal(second.lastIndex, 0, "07.03");
  equal(
    input.match(second),
    ["set one = namespace(", "set two = namespace("],
    "07.04",
  );
});

test("08 - namespace calls accept whitespace before the parenthesis", () => {
  equal(
    isJinjaSpecific().test("{% set ns = namespace (total=0) %}"),
    true,
    "08.01",
  );
  equal(
    isJinjaSpecific().test("{% set ns = namespace\t\n(total=0) %}"),
    true,
    "08.02",
  );
});

test.run();
