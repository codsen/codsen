import tap from "tap";
import r from "../dist/regex-jinja-specific.esm";

// /['"]%x?[\+0]?[.>^<]?\d+[\w%]['"]\|format\(/gi

tap.test("01 format with percentage", (t) => {
  t.match(`{{ '%.2%'|format(container.price.total) }}`, r(), "01");
  t.end();
});

tap.test("02 format in exponent notation", (t) => {
  t.match(`{{ '%.2e'|format(container.price.total) }}`, r(), "02");
  t.end();
});

tap.test("03 no decimal places", (t) => {
  t.match(`{{ '%.0f'|format(container.price.total) }}`, r(), "03");
  t.end();
});

tap.test("04 two decimal places", (t) => {
  t.match(`{{ '%.2f'|format(container.price.total) }}`, r(), "04");
  t.end();
});

tap.test("05 two decimal places, with sign", (t) => {
  t.match(`{{ '%+.2f'|format(container.price.total) }}`, r(), "05");
  t.end();
});

tap.test("06 pad a number, left side, width 2", (t) => {
  t.match(`{{ '%0>2d'|format(container.price.total) }}`, r(), "06");
  t.end();
});

tap.test("07 pad a number, left side, width 2", (t) => {
  t.match(`{{ '%0>2d'|format(container.price.total) }}`, r(), "07");
  t.end();
});

tap.test("08 pad right side", (t) => {
  t.match(`{{ '%x<4d'|format(container.price.total) }}`, r(), "08");
  t.end();
});

tap.test("09 center aligned", (t) => {
  t.match(`{{ '%^10d'|format(container.price.total) }}`, r(), "09");
  t.end();
});

tap.test("10 left aligned", (t) => {
  t.match(`{{ '%<10d'|format(container.price.total) }}`, r(), "10");
  t.end();
});

tap.test("11 right aligned", (t) => {
  t.match(`{{ '%10d'|format(container.price.total) }}`, r(), "11");
  t.end();
});
