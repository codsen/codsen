import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("01 - multiple lines - mac endings", () => {
  equal(c("  abc  \n  def  \n  ghi  "), " abc  \n  def  \n  ghi ", "01");
});

test("02 - multiple lines - windows endings, clean", () => {
  equal(
    c("  abc  \r\n  def  \r\n  ghi  "),
    " abc  \r\n  def  \r\n  ghi ",
    "02"
  );
});

test("03 - multiple lines - windows endings, mixed", () => {
  equal(c("  abc  \n  def  \r\n  ghi  "), " abc  \n  def  \r\n  ghi ", "03");
});

test.run();
