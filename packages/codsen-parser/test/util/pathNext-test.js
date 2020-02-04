const t = require("tap");
import p from "../../src/util/pathNext";

t.test("01 - empty str", t => {
  t.same(p(""), "", "01");
  t.end();
});

t.test("02 - upon first element", t => {
  t.same(p("0"), "1", "02");
  t.end();
});

t.test("03 - upon second element", t => {
  t.same(p("1"), "2", "03");
  t.end();
});

t.test(
  "04 - theoretically, not possible but, last chunk is not numeric string",
  t => {
    t.same(p("1.z"), "1.z", "04");
    t.end();
  }
);

t.test(
  "05 - theoretically, not possible but, one level deep, no .children",
  t => {
    t.same(p("9.children.3"), "9.children.4", "05");
    t.end();
  }
);

t.test(
  "06 - theoretically, not possible but, one level deep, no .children",
  t => {
    t.same(p("9.children.1.children.0"), "9.children.1.children.1", "06");
    t.end();
  }
);
