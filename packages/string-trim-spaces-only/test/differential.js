import { test } from "uvu";
import { equal } from "uvu/assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

const referenceDefaults = {
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false,
};

function referenceTrim(str, opts) {
  const resolved = { ...referenceDefaults, ...opts };
  const check = (char) =>
    resolved.classicTrim
      ? !char.trim()
      : (resolved.space && char === " ") ||
        (resolved.cr && char === "\r") ||
        (resolved.lf && char === "\n") ||
        (resolved.tab && char === "\t") ||
        (resolved.nbsp && char === "\u00a0");

  let start = 0;
  while (start < str.length && check(str[start])) {
    start += 1;
  }
  if (start === str.length && str.length) {
    return { res: "", ranges: [[0, str.length]] };
  }

  let end = str.length;
  while (end > start && check(str[end - 1])) {
    end -= 1;
  }

  const ranges = [];
  if (start) {
    ranges.push([0, start]);
  }
  if (end < str.length) {
    ranges.push([end, str.length]);
  }
  return { res: str.slice(start, end), ranges };
}

function verifyCase(str, opts, caseNumber) {
  const actual = trimSpaces(str, opts);
  const expected = referenceTrim(str, opts);

  if (
    actual.res !== expected.res ||
    actual.ranges.length !== expected.ranges.length ||
    actual.ranges.some(
      (range, index) =>
        range[0] !== expected.ranges[index][0] ||
        range[1] !== expected.ranges[index][1],
    )
  ) {
    throw new Error(
      `Differential case ${caseNumber} failed for ${JSON.stringify({ str, opts, actual, expected })}`,
    );
  }

  let cursor = 0;
  let reconstructed = "";
  for (const range of actual.ranges) {
    if (range[0] < cursor || range[1] < range[0] || range[1] > str.length) {
      throw new Error(
        `Invalid range in differential case ${caseNumber}: ${JSON.stringify(range)}`,
      );
    }
    reconstructed += str.slice(cursor, range[0]);
    cursor = range[1];
  }
  reconstructed += str.slice(cursor);
  if (reconstructed !== actual.res) {
    throw new Error(`Range reconstruction failed in case ${caseNumber}`);
  }
}

test("01 - scanner matches the exhaustive reference corpus", () => {
  const alphabet = [" ", "\r", "\n", "\t", "\u00a0", "a", "😀"];
  const generated = [""];
  let frontier = [""];
  for (let length = 1; length <= 5; length += 1) {
    const next = [];
    for (const prefix of frontier) {
      for (const char of alphabet) {
        const value = prefix + char;
        next.push(value);
        generated.push(value);
      }
    }
    frontier = next;
  }

  let comparisons = 0;
  for (let mask = 0; mask < 32; mask += 1) {
    const opts = {
      classicTrim: false,
      cr: Boolean(mask & 1),
      lf: Boolean(mask & 2),
      tab: Boolean(mask & 4),
      space: Boolean(mask & 8),
      nbsp: Boolean(mask & 16),
    };
    for (const str of generated) {
      comparisons += 1;
      verifyCase(str, opts, comparisons);
    }
  }

  for (let code = 0; code <= 0xffff; code += 1) {
    const char = String.fromCharCode(code);
    comparisons += 1;
    verifyCase(`${char}a${char}`, { classicTrim: true }, comparisons);
  }

  const focusedCases = [
    ["", undefined],
    ["a", undefined],
    ["   ", undefined],
    [" a ", undefined],
    ["\ta\t", { tab: true }],
    ["\na\n", { lf: true }],
    ["\ra\r", { cr: true }],
    ["\u00a0a\u00a0", { nbsp: true }],
    [" a ", { space: false }],
    [" \ta\t ", { space: true, tab: true }],
    [" \na\n ", { space: true, lf: true }],
    [" \ra\r ", { space: true, cr: true }],
    [" \u00a0a\u00a0 ", { space: true, nbsp: true }],
    ["\t\n\ra\r\n\t", { classicTrim: true }],
    ["😀", { classicTrim: true }],
    [" 😀 ", { classicTrim: true }],
    [" \ud800 ", { classicTrim: true }],
    [" \udc00 ", { classicTrim: true }],
    ["\u2000a\u2000", { classicTrim: true }],
    ["\ufeffa\ufeff", { classicTrim: true }],
    ["\u0085a\u0085", { classicTrim: true }],
    ["\0a\0", { classicTrim: true }],
    [" a\n ", undefined],
    ["\na\n", { lf: false }],
    ["\u00a0a\u00a0", { nbsp: false }],
  ];
  for (const [str, opts] of focusedCases) {
    comparisons += 1;
    verifyCase(str, opts, comparisons);
  }

  equal(comparisons, 693_017, "01.01");
});

test.run();
