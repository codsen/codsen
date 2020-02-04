const t = require("tap");
import p from "../../src/util/pathUp";

t.test("01 - empty str", t => {
  t.same(p(""), "0", "01");
  t.end();
});

t.test("02 - upon first element", t => {
  t.same(p("0"), "0", "02");
  t.end();
});

t.test("03 - upon second element", t => {
  t.same(p("1"), "0", "03");
  t.end();
});

t.test("04 - non-numeric", t => {
  t.same(p("1.z"), "0", "04");
  t.end();
});

t.test("05 - usual", t => {
  t.same(p("9.children.3"), "9", "05");
  t.end();
});

t.test("06 - usual, two levels", t => {
  t.same(p("9.children.1.children.2"), "9.children.1", "06");
  t.end();
});
