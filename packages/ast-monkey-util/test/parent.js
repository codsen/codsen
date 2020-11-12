import tap from "tap";
import { parent } from "../dist/ast-monkey-util.esm";

tap.test(`01`, (t) => {
  t.strictSame(parent(null), null, "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(parent(1), null, "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(parent(""), null, "03");
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(parent("0"), null, "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(parent("1"), null, "05");
  t.end();
});

tap.test(`06`, (t) => {
  t.strictSame(parent("a"), null, "06");
  t.end();
});

tap.test(`07`, (t) => {
  t.strictSame(parent("1.z"), "1", "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.strictSame(parent("a.b"), "a", "08");
  t.end();
});

tap.test(`09`, (t) => {
  t.strictSame(parent("a.b.c"), "b", "09");
  t.end();
});

tap.test(`10`, (t) => {
  t.strictSame(parent("a.0.c"), "0", "10");
  t.end();
});

tap.test(`11`, (t) => {
  t.strictSame(parent("9.children.3"), "children", "11");
  t.end();
});

tap.test(`12`, (t) => {
  t.strictSame(parent("9.children.1.children.2"), "children", "12");
  t.end();
});
