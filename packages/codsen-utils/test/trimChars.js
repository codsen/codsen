import { test } from "uvu";
import { equal } from "uvu/assert";

import { trimChars } from "../dist/codsen-utils.esm.js";

test("01 - trims one ASCII character", () => {
  equal(trimChars("///article///", "/"), "article", "01.01");
  equal(trimChars("article", "/"), "article", "01.02");
  equal(trimChars("////", "/"), "", "01.03");
});

test("02 - trims an ASCII character set", () => {
  equal(trimChars("//article/>", "/>"), "article", "02.01");
  equal(trimChars("article", "/>"), "article", "02.02");
  equal(trimChars("/>/>", "/>"), "", "02.03");
});

test("03 - returns empty inputs unchanged", () => {
  equal(trimChars("", "/>"), "", "03.01");
  equal(trimChars("article", ""), "article", "03.02");
});

test("04 - trims Unicode code points", () => {
  equal(trimChars("😀😀article😀", "😀"), "article", "04.01");
  equal(trimChars("article", "😀"), "article", "04.02");
  equal(trimChars("😀😀", "😀"), "", "04.03");
});

test("05 - trims mixed BMP and astral characters", () => {
  equal(trimChars("éßarticleßé", "éß"), "article", "05.01");
  equal(trimChars("é😀🧪article🧪😀é", "é😀🧪"), "article", "05.02");
  equal(trimChars("é😀🧪😀é", "é😀🧪"), "", "05.03");
  equal(trimChars("😀article🧪", "é"), "😀article🧪", "05.04");
  equal(trimChars("éßé", "éß"), "", "05.05");
  equal(trimChars("éß😀ßé", "éß"), "😀", "05.06");
  equal(trimChars("é\ud83dé", "é"), "\ud83d", "05.07");
  equal(trimChars("é\ude00é", "é"), "\ude00", "05.08");
});

test("06 - lone surrogates do not match part of a valid pair", () => {
  equal(trimChars("\ud83d😀article😀\ud83d", "\ud83d"), "😀article😀", "06.01");
  equal(trimChars("\ude00😀article😀\ude00", "\ude00"), "😀article😀", "06.02");
  equal(trimChars("😀article😀", "\ud83dx\ude00"), "😀article😀", "06.03");
});

test("07 - astral trim characters do not match lone surrogates", () => {
  equal(trimChars("\ud83d😀\ude00", "😀"), "\ud83d😀\ude00", "07.01");
  equal(
    trimChars("😀\ud83darticle\ude00😀", "😀"),
    "\ud83darticle\ude00",
    "07.02",
  );
  equal(trimChars("😀\ud83d😀", "😀"), "\ud83d", "07.03");
  equal(trimChars("😀\ude00😀", "😀"), "\ude00", "07.04");
});

test("08 - preserves code point boundaries while trimming malformed text", () => {
  equal(trimChars("\ud83d😀\ude00", "\ud83dx\ude00"), "😀", "08.01");
  equal(trimChars("\ud83d\ud83d", "\ud83d"), "", "08.02");
  equal(trimChars("\ude00\ude00", "\ude00"), "", "08.03");
  equal(trimChars("é😀\ud83dx\ude00😀é", "é😀\ud83dx\ude00"), "", "08.04");
});

test("09 - preserves a large Unicode middle exactly", () => {
  const middle = `a${"😀é\ud83d.\ude00".repeat(2048)}z`;

  equal(trimChars(`é😀${middle}😀é`, "é😀"), middle, "09.01");
  equal(trimChars(middle, "é😀"), middle, "09.02");
});

test("10 - preserves NUL and single retained code units", () => {
  equal(trimChars("a", "\0😀"), "a", "10.01");
  equal(trimChars("😀\0a😀", "😀"), "\0a", "10.02");
  equal(trimChars("\0😀", "😀"), "\0", "10.03");
});

test.run();
