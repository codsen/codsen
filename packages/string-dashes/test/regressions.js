import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { convertAll, convertOne } from "../dist/string-dashes.esm.js";

test("01 - supplied spans use the operand beyond all following whitespace", () => {
  for (const token of ["&#45;", "&ndash;", "&mdash;", "@@", "-"]) {
    for (const [left, right] of [
      ["1", "2"],
      ["$5", "$2"],
      ["5$", "2$"],
    ]) {
      for (const whitespace of [" ", "  ", "\t\t", "\n\n", " \t\n"]) {
        for (const convertEntities of [false, true]) {
          const input = `${left} ${token}${whitespace}${right}`;
          const from = left.length + 1;
          const to = from + token.length;
          const ranges = convertOne(input, {
            from,
            to,
            value: "-",
            convertEntities,
          });
          equal(
            ranges,
            [[from, to, convertEntities ? "&ndash;" : "–"]],
            "01.01",
          );
          equal(
            rApply(input, ranges),
            `${left} ${convertEntities ? "&ndash;" : "–"}${whitespace}${right}`,
            "01.02",
          );
        }
      }
    }
  }
});

test("02 - spaced em dashes receive the arithmetic correction", () => {
  for (const [left, right] of [
    ["1", "2"],
    ["$5", "$2"],
    ["5$", "2$"],
  ]) {
    for (const whitespace of [" ", "  ", "\t\t", "\n\n"]) {
      for (const convertEntities of [false, true]) {
        const input = `${left}${whitespace}—${whitespace}${right}`;
        const from = left.length + whitespace.length;
        const expected = [[from, from + 1, convertEntities ? "&ndash;" : "–"]];
        equal(convertOne(input, { from, convertEntities }), expected, "02.01");
        equal(
          convertAll(input, { convertEntities }),
          {
            result: `${left}${whitespace}${convertEntities ? "&ndash;" : "–"}${whitespace}${right}`,
            ranges: expected,
          },
          "02.02",
        );
        const supplied = `${left}${whitespace}&mdash;${whitespace}${right}`;
        equal(
          convertOne(supplied, {
            from,
            to: from + 7,
            value: "—",
            convertEntities,
          }),
          [[from, from + 7, convertEntities ? "&ndash;" : "–"]],
          "02.03",
        );
      }
    }
  }
});

test("03 - correct prose em dashes remain unchanged", () => {
  for (const convertEntities of [false, true]) {
    for (const input of ["a — b", "a  —  b", '"I was just abo—"']) {
      equal(
        convertAll(input, { convertEntities }),
        { result: input, ranges: [] },
        "03.01",
      );
      equal(
        convertOne(input, { from: input.indexOf("—"), convertEntities }),
        null,
        "03.02",
      );
    }
    equal(
      convertOne("a &mdash; b", {
        from: 2,
        to: 9,
        value: "—",
        convertEntities,
      }),
      null,
      "03.03",
    );
  }
});

test("04 - omitted and undefined conversion flags agree in both APIs", () => {
  for (const convertDashes of [true, undefined]) {
    equal(
      convertAll("1-2", { convertDashes, convertEntities: undefined }),
      convertAll("1-2"),
      "04.01",
    );
    equal(
      convertOne("1-2", { from: 1, convertDashes, convertEntities: undefined }),
      convertOne("1-2", { from: 1 }),
      "04.02",
    );
  }
  equal(
    convertAll("1-2", { convertDashes: false }),
    { result: "1-2", ranges: [] },
    "04.03",
  );
  equal(convertOne("1-2", { from: 1, convertDashes: false }), null, "04.04");
  equal(
    convertAll("", { convertDashes: undefined }),
    { result: "", ranges: null },
    "04.05",
  );
});

test("05 - replacement spans must be ordered and within the input", () => {
  for (const to of [-1, 0, 4, 10]) {
    throws(
      () => convertOne("A-B", { from: 1, to, value: "-" }),
      /string-dashes\/convertOne\(\): \[THROW_ID_05\]/,
      "05.01",
    );
  }
  equal(convertOne("A-B", { from: 1 }), [[1, 2, "–"]], "05.02");
  equal(
    convertOne("12", { from: 1, to: 1, value: "-" }),
    [[1, 1, "–"]],
    "05.03",
  );
  equal(
    convertOne("1&#45;2", { from: 1, to: 6, value: "-" }),
    [[1, 6, "–"]],
    "05.04",
  );
});

test("06 - null required options use the package diagnostic", () => {
  for (const opts of [null, undefined, true, 1, "x", []]) {
    throws(
      () => convertOne("1-2", opts),
      /string-dashes\/convertOne\(\): \[THROW_ID_02\]/,
      "06.01",
    );
  }
  equal(convertAll("1-2", null), convertAll("1-2"), "06.02");
});

test("07 - browser and ESM artifacts agree on arithmetic, defaults and diagnostics", () => {
  const context = {};
  runInNewContext(
    readFileSync(
      new URL("../dist/string-dashes.umd.js", import.meta.url),
      "utf8",
    ),
    context,
  );
  const browser = context.stringDashes;
  for (const input of ["1 — 2", "$5  —  $2", "a — b", "1-2"]) {
    for (const convertEntities of [false, true]) {
      equal(
        JSON.parse(
          JSON.stringify(
            browser.convertAll(input, {
              convertEntities,
              convertDashes: undefined,
            }),
          ),
        ),
        convertAll(input, { convertEntities }),
        "07.01",
      );
    }
  }
  const opts = { from: 2, to: 7, value: "-" };
  equal(
    JSON.parse(JSON.stringify(browser.convertOne("1 &#45;  2", opts))),
    convertOne("1 &#45;  2", opts),
    "07.02",
  );
  throws(
    () => browser.convertOne("A-B", { from: 1, to: 0, value: "-" }),
    /THROW_ID_05/,
    "07.03",
  );
  throws(() => browser.convertOne("1-2", null), /THROW_ID_02/, "07.04");
});

test.run();
