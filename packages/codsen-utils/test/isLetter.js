// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isLetter } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isLetter("a"), true, "01.01");
});

test("02", () => {
  equal(isLetter("A"), true, "02.01");
});

test("03", () => {
  equal(isLetter("ж"), true, "03.01");
});

test("04", () => {
  equal(isLetter("_"), false, "04.01");
});

test("05", () => {
  equal(isLetter("9"), false, "05.01");
});

test("06", () => {
  equal(isLetter(), false, "06.01");
});

test("07", () => {
  equal(isLetter(null), false, "07.01");
});

test("08", () => {
  equal(isLetter(NaN), false, "08.01");
  equal(isLetter(0 / 0), false, "08.02");
  equal(isLetter(1 / 0), false, "08.03");
  equal(isLetter(-1 / 0), false, "08.04");
});

test("09", () => {
  equal(isLetter(undefined), false, "09.01");
});

test("10", () => {
  equal(isLetter(true), false, "10.01");
});

test("11", () => {
  equal(isLetter(" "), false, "11.01");
});

test("12", () => {
  equal(isLetter("\n"), false, "12.01");
  equal(isLetter("\r"), false, "12.02");
  equal(isLetter("\r\n"), false, "12.03");
});

test("13 - Unicode scripts and scalar boundaries", () => {
  equal(isLetter("é"), true, "13.01");
  equal(isLetter("Ж"), true, "13.02");
  equal(isLetter("東"), true, "13.03");
  equal(isLetter("ا"), true, "13.04");
  equal(isLetter("א"), true, "13.05");
  equal(isLetter("क"), true, "13.06");
  equal(isLetter("𐐀"), true, "13.07");
  equal(isLetter("𐐨"), true, "13.08");
  equal(isLetter("\u0301"), false, "13.09");
  equal(isLetter("。"), false, "13.10");
  equal(isLetter("٢"), false, "13.11");
  equal(isLetter("a\u0301"), false, "13.12");
  equal(isLetter("ab"), false, "13.13");
  equal(isLetter("\ud801"), false, "13.14");
  equal(isLetter("\udc00"), false, "13.15");
  equal(isLetter("\udc00\ud801"), false, "13.16");
});

test("14 - agrees with Unicode Letter for every scalar", () => {
  const unicodeLetter = /^\p{L}$/u;
  for (let codePoint = 0; codePoint <= 0x10ffff; codePoint += 1) {
    if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
      continue;
    }
    const character = String.fromCodePoint(codePoint);
    equal(isLetter(character), unicodeLetter.test(character), `14.${codePoint}`);
  }
});

test.run();
