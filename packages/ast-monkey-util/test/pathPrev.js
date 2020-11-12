import tap from "tap";
import { pathPrev } from "../dist/ast-monkey-util.esm";

tap.test(`01`, (t) => {
  t.strictSame(pathPrev(true), null, "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(pathPrev(1), null, "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(pathPrev(""), null, "03");
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(pathPrev("0"), null, "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(pathPrev("1"), "0", "05");
  t.end();
});

tap.test(`06`, (t) => {
  t.strictSame(pathPrev("1.z"), null, "06");
  t.end();
});

tap.test(`07`, (t) => {
  t.strictSame(pathPrev("9.children.33"), "9.children.32", "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.strictSame(
    pathPrev("9.children.1.children.2"),
    "9.children.1.children.1",
    "08"
  );
  t.end();
});
