import tap from "tap";
import { pathNext } from "../dist/ast-monkey-util.esm";

tap.test(`01`, (t) => {
  t.strictSame(pathNext(null), null, "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(pathNext(1), null, "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(pathNext(""), null, "03");
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(pathNext("0"), "1", "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(pathNext("1"), "2", "05");
  t.end();
});

tap.test(`06`, (t) => {
  t.strictSame(pathNext("1.z"), "1.z", "06");
  t.end();
});

tap.test(`07`, (t) => {
  t.strictSame(pathNext("9.children.3"), "9.children.4", "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.strictSame(
    pathNext("9.children.1.children.0"),
    "9.children.1.children.1",
    "08"
  );
  t.end();
});
