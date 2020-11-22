import tap from "tap";
import { xBeforeYOnTheRight } from "../../src/util";

// xBeforeYOnTheRight(str, startingIdx, x, y)

tap.test("01", (t) => {
  t.is(xBeforeYOnTheRight("abc de", 2, "d", "e"), true, "01");
  t.end();
});

tap.test("02", (t) => {
  t.is(xBeforeYOnTheRight("abc de", 2, "e", "d"), false, "02");
  t.end();
});

tap.test("03", (t) => {
  t.is(xBeforeYOnTheRight("abc de", 2, ".", "d"), false, "03");
  t.end();
});

tap.test("04", (t) => {
  t.is(xBeforeYOnTheRight("abc de", 2, "e", "."), true, "04");
  t.end();
});
