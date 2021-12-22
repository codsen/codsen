import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

const rawNbsp = "\u00A0";

test("01 - nbsp - left side - blank", () => {
  equal(c(`${rawNbsp}zzz`), `${rawNbsp}zzz`, "01");
});

test("02 - nbsp - left side - space + nbsp", () => {
  equal(c(` ${rawNbsp}zzz`), `${rawNbsp}zzz`, "02");
});

test("03 - nbsp - left side - two spaces", () => {
  equal(c(`  ${rawNbsp}zzz`), `${rawNbsp}zzz`, "03");
});

test("04 - nbsp - left side - nbsp + space", () => {
  equal(c(`${rawNbsp} zzz`), `${rawNbsp} zzz`, "04");
});

test("05 - nbsp - left side - nbsp + two spaces", () => {
  equal(c(`${rawNbsp}  zzz`), `${rawNbsp} zzz`, "05");
});

test("06 - nbsp - left side - eol + nbsp", () => {
  equal(c(`\n${rawNbsp}zzz`), `\n${rawNbsp}zzz`, "06");
});

test("07 - nbsp - left side - nbsp + eol", () => {
  equal(c(`${rawNbsp}\nzzz`), `${rawNbsp}\nzzz`, "07");
});

test("08 - nbsp - left side - multiple eols", () => {
  equal(c(`\n\n${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "08");
});

test("09 - nbsp - left side - multiple spaced eols", () => {
  equal(c(`  \n \n   ${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "09");
});

test("10 - nbsp - right side - blank", () => {
  equal(c(`zzz${rawNbsp}`), `zzz${rawNbsp}`, "10");
});

test("11 - nbsp - right side - nbsp + space", () => {
  equal(c(`zzz${rawNbsp} `), `zzz${rawNbsp}`, "11");
});

test("12 - nbsp - right side - nbsp + two spaces", () => {
  equal(c(`zzz${rawNbsp}  `), `zzz${rawNbsp}`, "12");
});

test("13 - nbsp - right side - space + nbsp", () => {
  equal(c(`zzz ${rawNbsp}`), `zzz ${rawNbsp}`, "13");
});

test("14 - nbsp - right side - two spaces + nbsp", () => {
  equal(c(`zzz  ${rawNbsp}`), `zzz ${rawNbsp}`, "14");
});

test("15 - nbsp - right side - nbsp + eol", () => {
  equal(c(`zzz${rawNbsp}\n`), `zzz${rawNbsp}\n`, "15");
});

test("16 - nbsp - right side - eol + nbsp", () => {
  equal(c(`zzz\n${rawNbsp}`), `zzz\n${rawNbsp}`, "16");
});

test("17 - nbsp - right side - mulitple eols", () => {
  equal(c(`zzz\n${rawNbsp}\n\n`, 3), `zzz\n${rawNbsp}\n\n`, "17");
});

test("18 - nbsp - right side - multiple spaced eols", () => {
  equal(c(`zzz\n${rawNbsp}  \n \n   `, 3), `zzz\n${rawNbsp}\n\n`, "18");
});

test.run();
