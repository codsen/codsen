import tap from "tap";
import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

tap.test("01 - not a string input", (t) => {
  t.equal(c(1), 1, "01");
  t.end();
});

tap.test("02 - not a string input", (t) => {
  t.equal(c(1, 1), 1, "02");
  t.end();
});

tap.test("03 - not a string input", (t) => {
  t.equal(c(1, 2), 1, "03");
  t.end();
});

tap.test("04 - not a string input", (t) => {
  t.equal(c(1, "zz"), 1, "04");
  t.end();
});
