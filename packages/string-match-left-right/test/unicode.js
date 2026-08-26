// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  matchLeft,
  matchLeftIncl,
  matchRight,
  matchRightIncl,
} from "../dist/string-match-left-right.esm.js";

test("01 - exact astral matches use UTF-16 code-unit indexes", () => {
  const source = "A😀B";

  equal(matchRight(source, 0, "😀"), "😀", "01.01");
  equal(matchRightIncl(source, 1, "😀"), "😀", "01.02");
  equal(matchLeft(source, 3, "😀"), "😀", "01.03");
  equal(matchLeftIncl(source, 2, "😀"), "😀", "01.04");
});

test("02 - ordinary callback context exposes one code unit", () => {
  const contexts = [];
  const cb = (character, remainder, index) => {
    contexts.push([character, remainder, index]);
    return true;
  };

  equal(matchRightIncl("A😀", 0, "A", { cb }), "A", "02.01");
  equal(matchRight("xA😀", 0, "A", { cb }), "A", "02.02");
  equal(matchLeftIncl("😀B", 2, "B", { cb }), "B", "02.03");
  equal(matchLeft("😀Bx", 3, "B", { cb }), "B", "02.04");
  equal(
    contexts,
    [
      ["\ud83d", "😀", 1],
      ["\ud83d", "😀", 2],
      ["\ude00", "😀", 1],
      ["\ude00", "😀", 1],
    ],
    "02.05",
  );
});

test("03 - callback-only context exposes one code unit", () => {
  const contexts = [];
  const cb = (character, remainder, index) => {
    contexts.push([character, remainder, index]);
    return true;
  };

  equal(matchRightIncl("😀", 0, "", { cb }), true, "03.01");
  equal(matchRight("x😀", 0, "", { cb }), true, "03.02");
  equal(matchLeftIncl("😀", 1, "", { cb }), true, "03.03");
  equal(matchLeft("😀x", 2, "", { cb }), true, "03.04");
  equal(
    contexts,
    [
      ["\ud83d", "😀", 0],
      ["\ud83d", "😀", 1],
      ["\ude00", "😀", 1],
      ["\ude00", "😀", 1],
    ],
    "03.05",
  );
});

test("04 - combining marks and ZWJ sequences match exactly", () => {
  const combining = "e\u0301";
  const zwj = "👩‍💻";

  equal(matchRight(`A${combining}B`, 0, combining), combining, "04.01");
  equal(matchLeft(`A${combining}B`, 3, combining), combining, "04.02");
  equal(matchRight(`A${zwj}B`, 0, zwj), zwj, "04.03");
  equal(matchRightIncl(`A${zwj}B`, 1, zwj), zwj, "04.04");
  equal(matchLeft(`A${zwj}B`, 6, zwj), zwj, "04.05");
  equal(matchLeftIncl(`A${zwj}B`, 5, zwj), zwj, "04.06");
});

test("05 - case-insensitive matching folds individual code units", () => {
  equal(matchRightIncl("Ä", 0, "ä", { i: true }), "ä", "05.01");
  equal(matchRightIncl("𐐀", 0, "𐐨", { i: true }), false, "05.02");
  equal(matchRightIncl("𐐀", 0, "𐐀", { i: true }), "𐐀", "05.03");
});

test("06 - mismatch rules count matcher code units", () => {
  equal(matchRightIncl("😀", 0, "😁"), false, "06.01");
  equal(
    matchRightIncl("😀", 0, "😁", {
      maxMismatches: 1,
      firstMustMatch: true,
    }),
    "😁",
    "06.02",
  );
  equal(
    matchRightIncl("😀ab.def", 4, "cde", {
      maxMismatches: 1,
      hungry: true,
    }),
    "cde",
    "06.03",
  );
  equal(
    matchRightIncl("😀ab.def", 4, "cde", {
      maxMismatches: 1,
      firstMustMatch: true,
      hungry: true,
    }),
    false,
    "06.04",
  );
  equal(
    matchRightIncl("😀abcd.f", 4, "cde", { maxMismatches: 1 }),
    "cde",
    "06.05",
  );
  equal(
    matchRightIncl("😀abcd.f", 4, "cde", {
      maxMismatches: 1,
      lastMustMatch: true,
    }),
    false,
    "06.06",
  );
});

test.run();
