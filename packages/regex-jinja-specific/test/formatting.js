import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

// /['"]%x?[\+0]?[.>^<]?\d+[\w%]['"]\|format\(/gi

test("01 format with percentage", () => {
  match(
    `{{ '%.2%'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "01.01"
  );
});

test("02 format in exponent notation", () => {
  match(
    `{{ '%.2e'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "02.01"
  );
});

test("03 no decimal places", () => {
  match(
    `{{ '%.0f'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "03.01"
  );
});

test("04 two decimal places", () => {
  match(
    `{{ '%.2f'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "04.01"
  );
});

test("05 two decimal places, with sign", () => {
  match(
    `{{ '%+.2f'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "05.01"
  );
});

test("06 pad a number, left side, width 2", () => {
  match(
    `{{ '%0>2d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "06.01"
  );
});

test("07 pad a number, left side, width 2", () => {
  match(
    `{{ '%0>2d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "07.01"
  );
});

test("08 pad right side", () => {
  match(
    `{{ '%x<4d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "08.01"
  );
});

test("09 center aligned", () => {
  match(
    `{{ '%^10d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "09.01"
  );
});

test("10 left aligned", () => {
  match(
    `{{ '%<10d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "10.01"
  );
});

test("11 right aligned", () => {
  match(
    `{{ '%10d'|format(container.price.total) }}`,
    isJinjaSpecific(),
    "11.01"
  );
});

test.run();
