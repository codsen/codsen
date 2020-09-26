import tap from "tap";
import findType from "../src/util/findType";

tap.throws(() => {
  findType(1);
});

tap.test("number", (t) => {
  findType("1", "numeric");
  findType("1.0", "numeric");
  findType("1.01", "numeric");
  findType("1.00", "numeric");
  findType("-1.00", "numeric");
  findType("-0.100", "numeric");
  t.end();
});

tap.test("currency", (t) => {
  findType("£1", "numeric");
  findType("$1.0", "numeric");
  findType("1.0 $", "numeric");
  findType("$ 1.0", "numeric");
  findType("1.0 $", "numeric");
  findType("$1.01", "numeric");
  findType("$ 1.01", "numeric");
  findType("€1.00", "numeric");
  findType("€ 1.00", "numeric");
  t.end();
});

tap.test("empty", (t) => {
  findType("", "empty");
  findType(" ", "empty");
  findType("\t", "empty");
  findType("\n\n\n", "empty");
  t.end();
});

tap.test("text", (t) => {
  findType("abc", "text");
  findType("1 abc", "text");
  t.end();
});
