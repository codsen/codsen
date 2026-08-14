import { test } from "uvu";
import { equal } from "uvu/assert";

import { auditDevConsoleLogLineLabels } from "../devConsoleLogLineLabels.js";

test("01 - accepts direct DEV conjunctions and DEV if statements", () => {
  const source = [
    "declare let DEV: boolean;",
    'DEV && console.log("002 direct");',
    "if (DEV) {",
    "  console.log(`004 block`);",
    "}",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 2,
      problems: [],
    },
    "01.01",
  );
});

test("02 - follows DEV guards into nested callbacks", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV && values.forEach(() => {",
    "  console.log(`003 conjunction callback`);",
    "});",
    "if (DEV) {",
    '  values.forEach(() => console.log("006 if callback"));',
    "}",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 2,
      problems: [],
    },
    "02.01",
  );
});

test("03 - ignores comments, unguarded calls, and DEV else branches", () => {
  const source = [
    "declare let DEV: boolean;",
    '// DEV && console.log("002 comment");',
    'console.log("003 runtime output");',
    'console.log("004 wrong side") && DEV;',
    "if (DEV) void 0; else console.log(`005 else`);",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 0,
      problems: [],
    },
    "03.01",
  );
});

test("04 - reports missing and stale labels without reading ANSI numbers", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV && console.log(`wrong $" + "{36} ANSI`);",
    "DEV && console.log(`002 stale`);",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 2,
      problems: [
        {
          column: 8,
          kind: "missing-label",
          line: 2,
          message:
            "DEV-guarded console.log first argument must start with a numeric line label",
        },
        {
          actual: 2,
          column: 21,
          expected: 3,
          kind: "wrong-label",
          line: 3,
          message: "DEV-guarded console.log line label 002 must be 3",
        },
      ],
    },
    "04.01",
  );
});

test("05 - validates the literal line in multiline calls", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV &&",
    "  console.log(",
    "    `004 multiline`,",
    "  );",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 1,
      problems: [],
    },
    "05.01",
  );
});

test("06 - accepts leading newlines and labels nested inside ANSI templates", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV && console.log(`\\n\\n002 banner`);",
    "DEV && console.log(`\\u001b[$" +
      "{31}m$" +
      "{`003 nested`}\\u001b[$" +
      "{39}m`);",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 2,
      problems: [],
    },
    "06.01",
  );
});

test("07 - accepts a visual marker before the line label", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV && console.log(`* 002 marked`);",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 1,
      problems: [],
    },
    "07.01",
  );
});

test("08 - locates stale labels after escaped newlines precisely", () => {
  const source = [
    "declare let DEV: boolean;",
    "DEV && console.log(`\\n001 escaped newline`);",
  ].join("\n");

  equal(
    auditDevConsoleLogLineLabels(source),
    {
      checkedCount: 1,
      problems: [
        {
          actual: 1,
          column: 23,
          expected: 2,
          kind: "wrong-label",
          line: 2,
          message: "DEV-guarded console.log line label 001 must be 2",
        },
      ],
    },
    "08.01",
  );
});

test.run();
