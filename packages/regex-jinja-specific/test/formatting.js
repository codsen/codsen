import { test } from "uvu";
import { equal, match } from "uvu/assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

test("01 - string conversion", () => {
  match("{{ '%s'|format(name) }}", isJinjaSpecific(), "01.01");
});

test("02 - format in exponent notation", () => {
  match(
    "{{ '%.2e'|format(container.price.total) }}",
    isJinjaSpecific(),
    "02.01",
  );
});

test("03 - no decimal places", () => {
  match(
    "{{ '%.0f'|format(container.price.total) }}",
    isJinjaSpecific(),
    "03.01",
  );
});

test("04 - two decimal places", () => {
  match(
    "{{ '%.2f'|format(container.price.total) }}",
    isJinjaSpecific(),
    "04.01",
  );
});

test("05 - two decimal places, with sign", () => {
  match(
    "{{ '%+.2f'|format(container.price.total) }}",
    isJinjaSpecific(),
    "05.01",
  );
});

test("06 - zero pad a number to width 2", () => {
  match(
    "{{ '%02d'|format(container.price.total) }}",
    isJinjaSpecific(),
    "06.01",
  );
});

test("07 - left align a number to width 10", () => {
  match(
    "{{ '%-10d'|format(container.price.total) }}",
    isJinjaSpecific(),
    "07.01",
  );
});

test("08 - hexadecimal conversion followed by a literal suffix", () => {
  match(
    "{{ '%x<4d'|format(container.price.total) }}",
    isJinjaSpecific(),
    "08.01",
  );
});

test("09 - hexadecimal conversion with its base prefix", () => {
  match(
    "{{ '%#x'|format(container.price.total) }}",
    isJinjaSpecific(),
    "09.01",
  );
});

test("10 - literal prefix and multiple conversions", () => {
  match(
    "{{ 'Balance for %s: %.2f'|format(name, total) }}",
    isJinjaSpecific(),
    "10.01",
  );
});

test("11 - right aligned", () => {
  match(
    "{{ '%10d'|format(container.price.total) }}",
    isJinjaSpecific(),
    "11.01",
  );
});

test("12 - filter markers accept spaces, tabs and newlines", () => {
  equal(isJinjaSpecific().test("{{ '%s' | format (name) }}"), true, "12.01");
  equal(isJinjaSpecific().test("{{ '%s'\t|\tformat\t(name) }}"), true, "12.02");
  equal(isJinjaSpecific().test("{{ '%s'\n|\nformat\n(name) }}"), true, "12.03");
});

test("13 - filter names require the format call marker", () => {
  equal(
    isJinjaSpecific().test("{{ '%s'|formatSomething(name) }}"),
    false,
    "13.01",
  );
  equal(isJinjaSpecific().test("{{ '%s'.format(name) }}"), false, "13.02");
  equal(isJinjaSpecific().test("{{ '%s'|format }}"), false, "13.03");
});

test("14 - global matching returns exact filter markers", () => {
  equal(
    "{{ '%s'|format(name) }} {{ '%d'| \tformat \n(value) }}".match(
      isJinjaSpecific(),
    ),
    ["|format(", "| \tformat \n("],
    "14.01",
  );
});

test("15 - a filter marker does not require a quoted operand", () => {
  equal(isJinjaSpecific().test("{{ pattern | format(value) }}"), true, "15.01");
});

test.run();
