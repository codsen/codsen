import { test } from "uvu";
import { equal, is } from "uvu/assert";

import { prefixDevLogOrigins } from "../devLogOrigins.js";

const origin = "src/main.ts";

function transform(lines) {
  return prefixDevLogOrigins(lines.join("\n"), origin);
}

test("01 - prefixes both guard forms with the origin", () => {
  equal(
    transform([
      "declare let DEV: boolean;",
      'DEV && console.log("direct");',
      "if (DEV) {",
      "  console.log(`block`);",
      "}",
    ]),
    [
      "declare let DEV: boolean;",
      'DEV && console.log("src/main.ts:2","direct");',
      "if (DEV) {",
      '  console.log("src/main.ts:4",`block`);',
      "}",
    ].join("\n"),
    "01.01",
  );
});

test("02 - numbers a multiline log by its message, not by its call", () => {
  equal(
    transform([
      "declare let DEV: boolean;",
      "DEV &&",
      "  console.log(",
      "    `multiline`,",
      "  );",
    ]),
    [
      "declare let DEV: boolean;",
      "DEV &&",
      '  console.log("src/main.ts:4",',
      "    `multiline`,",
      "  );",
    ].join("\n"),
    "02.01",
  );
});

test("03 - follows DEV guards into nested callbacks", () => {
  equal(
    transform([
      "declare let DEV: boolean;",
      "DEV && values.forEach(() => {",
      "  console.log(`conjunction callback`);",
      "});",
    ]),
    [
      "declare let DEV: boolean;",
      "DEV && values.forEach(() => {",
      '  console.log("src/main.ts:3",`conjunction callback`);',
      "});",
    ].join("\n"),
    "03.01",
  );
});

test("04 - leaves program output and commented-out logs alone", () => {
  const lines = [
    "declare let DEV: boolean;",
    '// DEV && console.log("comment");',
    "console.log(help);",
    'console.log("wrong side") && DEV;',
    "if (DEV) void 0; else console.log(`else`);",
  ];

  is(transform(lines), lines.join("\n"), "04.01");
});

test("05 - returns the source untouched when it logs nothing", () => {
  const source = ["export const one = 1;", "export const two = 2;"].join("\n");

  is(prefixDevLogOrigins(source, origin), source, "05.01");
});

test("06 - prefixes a breadcrumb logged without arguments", () => {
  equal(
    transform(["declare let DEV: boolean;", "DEV && console.log();"]),
    ["declare let DEV: boolean;", 'DEV && console.log("src/main.ts:2");'].join(
      "\n",
    ),
    "06.01",
  );
});

test("07 - leaves an unparseable file for esbuild to report", () => {
  const source = [
    "declare let DEV: boolean;",
    'DEV && console.log("unclosed"',
  ].join("\n");

  is(prefixDevLogOrigins(source, origin), source, "07.01");
});

test("08 - escapes an origin that would otherwise break the literal", () => {
  equal(
    prefixDevLogOrigins('DEV && console.log("quoted");', 'src/we"ird.ts'),
    'DEV && console.log("src/we\\"ird.ts:1","quoted");',
    "08.01",
  );
});

test.run();
