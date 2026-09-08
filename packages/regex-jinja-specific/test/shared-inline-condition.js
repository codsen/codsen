import { test } from "uvu";
import { equal } from "uvu/assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

test("01 - compact inline conditionals are shared for either quote style", () => {
  equal(
    isJinjaSpecific().test("{{'yes' if active else 'no'}}"),
    false,
    "01.01",
  );
  equal(
    isJinjaSpecific().test('{{"yes" if active else "no"}}'),
    false,
    "01.02",
  );
});

test("02 - spaced inline conditionals are shared for either quote style", () => {
  equal(
    isJinjaSpecific().test("{{ 'yes' if active else 'no' }}"),
    false,
    "02.01",
  );
  equal(
    isJinjaSpecific().test('{{ "yes" if active else "no" }}'),
    false,
    "02.02",
  );
});

test("03 - omitting else does not make an inline conditional Jinja-specific", () => {
  equal(isJinjaSpecific().test("{{'yes' if active}}"), false, "03.01");
  equal(isJinjaSpecific().test('{{ "yes" if active }}'), false, "03.02");
});

test("04 - longer inline strings and punctuation remain shared syntax", () => {
  equal(
    isJinjaSpecific().test(
      "{{ 'Status: open!' if active else 'Status: closed.' }}",
    ),
    false,
    "04.01",
  );
  equal(
    isJinjaSpecific().test('{{ "It\'s open!" if active else "Not yet..." }}'),
    false,
    "04.02",
  );
});

test("05 - namespace and number formatting still provide Jinja evidence", () => {
  equal(
    isJinjaSpecific().test(
      "{% set ns = namespace(total=0) %}{{'yes' if active else 'no'}}",
    ),
    true,
    "05.01",
  );
  equal(
    isJinjaSpecific().test(
      "{{ '%.2f'|format(total) if active else 'disabled' }}",
    ),
    true,
    "05.02",
  );
});

test.run();
