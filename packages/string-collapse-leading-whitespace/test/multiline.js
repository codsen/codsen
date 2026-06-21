// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("001 - multiple lines - mac endings", () => {
  equal(c("  abc  \n  def  \n  ghi  "), " abc  \n  def  \n  ghi ", "001.01");
});

test("002 - multiple lines - windows endings, clean", () => {
  equal(
    c("  abc  \r\n  def  \r\n  ghi  "),
    " abc  \r\n  def  \r\n  ghi ",
    "002.01",
  );
});

test("003 - multiple lines - windows endings, mixed", () => {
  equal(
    c("  abc  \n  def  \r\n  ghi  "),
    " abc  \n  def  \r\n  ghi ",
    "003.01",
  );
});

test.run();
