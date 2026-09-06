import fs from "node:fs";
import vm from "node:vm";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

const realm = vm.createContext({});
vm.runInContext(
  fs.readFileSync(
    new URL("../dist/string-split-by-whitespace.umd.js", import.meta.url),
    "utf8",
  ),
  realm,
);
const implementations = [
  splitByW,
  (str, opts) => Array.from(realm.stringSplitByWhitespace.splitByW(str, opts)),
];

function reference(str, ranges) {
  const result = [];
  let token = "";
  for (let i = 0; i < str.length; i += 1) {
    if (!str[i].trim() || ranges.some(([from, to]) => from <= i && i < to)) {
      if (token) result.push(token);
      token = "";
    } else {
      token += str[i];
    }
  }
  if (token) result.push(token);
  return result;
}

test("01 - exclude ignored starts before whitespace or end of input", () => {
  for (const split of implementations) {
    equal(split("abc", { ignoreRanges: [[1, 2]] }), ["a", "c"], "01.01");
    equal(split("ab", { ignoreRanges: [[1, 2]] }), ["a"], "01.02");
    equal(split("ab cd", { ignoreRanges: [[1, 4]] }), ["a", "d"], "01.03");
    equal(split("a😀b", { ignoreRanges: [[1, 3]] }), ["a", "b"], "01.04");
  }
});

test("02 - ordered traversal handles unsorted overlapping and empty spans", () => {
  for (const split of implementations) {
    for (const ranges of [
      [[0, 1]],
      [[5, 6]],
      [
        [1, 2],
        [2, 3],
      ],
      [
        [1, 4],
        [2, 3],
      ],
      [
        [3, 5],
        [1, 4],
      ],
      [[2, 2]],
      [[4, 2]],
      [[6, 9]],
      [[0, 10]],
      [
        [2, 5],
        [0, 1],
        [3, 4],
        [3, 4],
      ],
      [
        [-3, 0],
        [1, 2],
      ],
    ]) {
      equal(
        split("abcdef", { ignoreRanges: ranges }),
        reference("abcdef", ranges),
        "02.01",
      );
    }
  }
});

test("03 - undefined optional ranges use the default", () => {
  for (const split of implementations) {
    for (const str of ["a b", "", " \r\n\t\u00a0 "]) {
      equal(split(str, { ignoreRanges: undefined }), split(str), "03.01");
      equal(split(str, {}), split(str), "03.02");
    }
  }
});

test("04 - all short span combinations match independent character exclusion", () => {
  for (const split of implementations) {
    for (const str of [
      "ab cd",
      "a\tbc",
      " a b ",
      "abcde",
      "a\u00a0bc",
      "a😀b",
    ]) {
      const spans = [];
      for (let from = 0; from <= str.length; from += 1) {
        for (let to = from; to <= str.length; to += 1) spans.push([from, to]);
      }
      for (const first of spans) {
        for (const second of spans) {
          const ranges = [first, second];
          equal(
            split(str, { ignoreRanges: ranges }),
            reference(str, ranges),
            "04.01",
          );
        }
      }
    }
  }
});

test("05 - range preparation preserves caller arrays", () => {
  const ranges = Object.freeze([
    Object.freeze([5, 7]),
    Object.freeze([1, 3]),
    Object.freeze([2, 4]),
  ]);
  for (const split of implementations) {
    equal(
      splitByW("abcdefgh", { ignoreRanges: ranges }),
      ["a", "e", "h"],
      "05.01",
    );
    equal(
      split("abcdefgh", { ignoreRanges: ranges }),
      ["a", "e", "h"],
      "05.02",
    );
    equal(
      ranges,
      [
        [5, 7],
        [1, 3],
        [2, 4],
      ],
      "05.03",
    );
  }
});

test("06 - growing source and ignored spans avoid repeated full-list scans", () => {
  function countReads(n) {
    let reads = 0;
    const ignoreRanges = Array.from({ length: n }, (_, i) => {
      const range = [];
      Object.defineProperties(range, {
        0: {
          get: () => {
            reads += 1;
            return 11 * i;
          },
        },
        1: {
          get: () => {
            reads += 1;
            return 11 * i + 5;
          },
        },
      });
      return range;
    });
    const result = splitByW("{{x}} word ".repeat(n), { ignoreRanges });
    equal(result, Array(n).fill("word"), "06.01");
    return reads;
  }
  const small = countReads(128);
  const large = countReads(256);
  ok(large < small * 2.2, "06.02 - endpoint reads scale with the range count");
  ok(large < 256 * 30, "06.03 - bounded endpoint reads per span");
});

test("07 - no-range splitting preserves native trim whitespace semantics", () => {
  let mismatches = 0;
  for (let code = 0; code <= 0xffff; code += 1) {
    const character = String.fromCharCode(code);
    const input = `a${character}b`;
    const expected = character.trim() ? [input] : ["a", "b"];
    if (JSON.stringify(splitByW(input)) !== JSON.stringify(expected))
      mismatches += 1;
  }
  equal(mismatches, 0, "07.01");
});

test.run();
