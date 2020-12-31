import tap from "tap";
import { isOpening } from "../dist/is-html-tag-opening.umd";

tap.test("UMD build works fine", (t) => {
  t.true(isOpening("<a>", 0), "01");
  t.end();
});
