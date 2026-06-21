// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

const rawNbsp = "\u00A0";

test("001 - nbsp - left side - blank", () => {
  equal(c(`${rawNbsp}zzz`), `${rawNbsp}zzz`, "001.01");
});

test("002 - nbsp - left side - space + nbsp", () => {
  equal(c(` ${rawNbsp}zzz`), `${rawNbsp}zzz`, "002.01");
});

test("003 - nbsp - left side - two spaces", () => {
  equal(c(`  ${rawNbsp}zzz`), `${rawNbsp}zzz`, "003.01");
});

test("004 - nbsp - left side - nbsp + space", () => {
  equal(c(`${rawNbsp} zzz`), `${rawNbsp} zzz`, "004.01");
});

test("005 - nbsp - left side - nbsp + two spaces", () => {
  equal(c(`${rawNbsp}  zzz`), `${rawNbsp} zzz`, "005.01");
});

test("006 - nbsp - left side - eol + nbsp", () => {
  equal(c(`\n${rawNbsp}zzz`), `\n${rawNbsp}zzz`, "006.01");
});

test("007 - nbsp - left side - nbsp + eol", () => {
  equal(c(`${rawNbsp}\nzzz`), `${rawNbsp}\nzzz`, "007.01");
});

test("008 - nbsp - left side - multiple eols", () => {
  equal(c(`\n\n${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "008.01");
});

test("009 - nbsp - left side - multiple spaced eols", () => {
  equal(c(`  \n \n   ${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "009.01");
});

test("010 - nbsp - right side - blank", () => {
  equal(c(`zzz${rawNbsp}`), `zzz${rawNbsp}`, "010.01");
});

test("011 - nbsp - right side - nbsp + space", () => {
  equal(c(`zzz${rawNbsp} `), `zzz${rawNbsp}`, "011.01");
});

test("012 - nbsp - right side - nbsp + two spaces", () => {
  equal(c(`zzz${rawNbsp}  `), `zzz${rawNbsp}`, "012.01");
});

test("013 - nbsp - right side - space + nbsp", () => {
  equal(c(`zzz ${rawNbsp}`), `zzz ${rawNbsp}`, "013.01");
});

test("014 - nbsp - right side - two spaces + nbsp", () => {
  equal(c(`zzz  ${rawNbsp}`), `zzz ${rawNbsp}`, "014.01");
});

test("015 - nbsp - right side - nbsp + eol", () => {
  equal(c(`zzz${rawNbsp}\n`), `zzz${rawNbsp}\n`, "015.01");
});

test("016 - nbsp - right side - eol + nbsp", () => {
  equal(c(`zzz\n${rawNbsp}`), `zzz\n${rawNbsp}`, "016.01");
});

test("017 - nbsp - right side - mulitple eols", () => {
  equal(c(`zzz\n${rawNbsp}\n\n`, 3), `zzz\n${rawNbsp}\n\n`, "017.01");
});

test("018 - nbsp - right side - multiple spaced eols", () => {
  equal(c(`zzz\n${rawNbsp}  \n \n   `, 3), `zzz\n${rawNbsp}\n\n`, "018.01");
});

test.run();
