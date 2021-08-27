import tap from "tap";
import { parent } from "../dist/ast-monkey-util.esm.js";

tap.test(`01`, (t) => {
  t.strictSame(parent(""), null, "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(parent("0"), null, "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(parent("1"), null, "03");
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(parent("a"), null, "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(parent("1.z"), "1", "05");
  t.end();
});

tap.test(`06`, (t) => {
  t.strictSame(parent("a.b"), "a", "06");
  t.end();
});

tap.test(`07`, (t) => {
  t.strictSame(parent("a.b.c"), "b", "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.strictSame(parent("a.0.c"), "0", "08");
  t.end();
});

tap.test(`09`, (t) => {
  t.strictSame(parent("9.children.3"), "children", "09");
  t.end();
});

tap.test(`10`, (t) => {
  t.strictSame(parent("9.children.1.children.2"), "children", "10");
  t.end();
});
