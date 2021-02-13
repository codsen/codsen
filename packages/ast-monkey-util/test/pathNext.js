import tap from "tap";
import { pathNext } from "../dist/ast-monkey-util.esm";

tap.test(`01`, (t) => {
  t.strictSame(pathNext("0"), "1", "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(pathNext("1"), "2", "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(pathNext("1.z"), "1.z", "03");
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(pathNext("9.children.3"), "9.children.4", "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(
    pathNext("9.children.1.children.0"),
    "9.children.1.children.1",
    "05"
  );
  t.end();
});
