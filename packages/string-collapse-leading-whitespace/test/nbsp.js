import tap from "tap";
import c from "../dist/string-collapse-leading-whitespace.esm";

const rawNbsp = "\u00A0";

tap.test("01 - nbsp - left side - blank", (t) => {
  t.equal(c(`${rawNbsp}zzz`), `${rawNbsp}zzz`, "01");
  t.end();
});

tap.test("02 - nbsp - left side - space + nbsp", (t) => {
  t.equal(c(` ${rawNbsp}zzz`), `${rawNbsp}zzz`, "02");
  t.end();
});

tap.test("03 - nbsp - left side - two spaces", (t) => {
  t.equal(c(`  ${rawNbsp}zzz`), `${rawNbsp}zzz`, "03");
  t.end();
});

tap.test("04 - nbsp - left side - nbsp + space", (t) => {
  t.equal(c(`${rawNbsp} zzz`), `${rawNbsp} zzz`, "04");
  t.end();
});

tap.test("05 - nbsp - left side - nbsp + two spaces", (t) => {
  t.equal(c(`${rawNbsp}  zzz`), `${rawNbsp} zzz`, "05");
  t.end();
});

tap.test("06 - nbsp - left side - eol + nbsp", (t) => {
  t.equal(c(`\n${rawNbsp}zzz`), `\n${rawNbsp}zzz`, "06");
  t.end();
});

tap.test("07 - nbsp - left side - nbsp + eol", (t) => {
  t.equal(c(`${rawNbsp}\nzzz`), `${rawNbsp}\nzzz`, "07");
  t.end();
});

tap.test("08 - nbsp - left side - multiple eols", (t) => {
  t.equal(c(`\n\n${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "08");
  t.end();
});

tap.test("09 - nbsp - left side - multiple spaced eols", (t) => {
  t.equal(c(`  \n \n   ${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "09");
  t.end();
});

tap.test("10 - nbsp - right side - blank", (t) => {
  t.equal(c(`zzz${rawNbsp}`), `zzz${rawNbsp}`, "10");
  t.end();
});

tap.test("11 - nbsp - right side - nbsp + space", (t) => {
  t.equal(c(`zzz${rawNbsp} `), `zzz${rawNbsp}`, "11");
  t.end();
});

tap.test("12 - nbsp - right side - nbsp + two spaces", (t) => {
  t.equal(c(`zzz${rawNbsp}  `), `zzz${rawNbsp}`, "12");
  t.end();
});

tap.test("13 - nbsp - right side - space + nbsp", (t) => {
  t.equal(c(`zzz ${rawNbsp}`), `zzz ${rawNbsp}`, "13");
  t.end();
});

tap.test("14 - nbsp - right side - two spaces + nbsp", (t) => {
  t.equal(c(`zzz  ${rawNbsp}`), `zzz ${rawNbsp}`, "14");
  t.end();
});

tap.test("15 - nbsp - right side - nbsp + eol", (t) => {
  t.equal(c(`zzz${rawNbsp}\n`), `zzz${rawNbsp}\n`, "15");
  t.end();
});

tap.test("16 - nbsp - right side - eol + nbsp", (t) => {
  t.equal(c(`zzz\n${rawNbsp}`), `zzz\n${rawNbsp}`, "16");
  t.end();
});

tap.test("17 - nbsp - right side - mulitple eols", (t) => {
  t.equal(c(`zzz\n${rawNbsp}\n\n`, 3), `zzz\n${rawNbsp}\n\n`, "17");
  t.end();
});

tap.test("18 - nbsp - right side - multiple spaced eols", (t) => {
  t.equal(c(`zzz\n${rawNbsp}  \n \n   `, 3), `zzz\n${rawNbsp}\n\n`, "18");
  t.end();
});
