import tap from "tap";
import { Linter, version } from "../dist/emlint.umd";

tap.test("shows version from UMD build", (t) => {
  t.match(version, /\d+\.\d+\.\d+/g, "01");
  t.end();
});

tap.test("config is truthy and is not an object", (t) => {
  const linter = new Linter();
  t.throws(() => {
    linter.verify("a", true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("config is an empty object", (t) => {
  const linter = new Linter();
  t.strictSame(linter.verify("a", {}), [], "03");
  t.end();
});

tap.test("config is falsey", (t) => {
  const linter = new Linter();
  t.strictSame(linter.verify("a", null), [], "04.01");
  t.strictSame(linter.verify("a", false), [], "04.02");
  t.strictSame(linter.verify("a", undefined), [], "04.03");
  t.strictSame(linter.verify("a", 0), [], "04.04");
  t.strictSame(linter.verify("a", []), [], "04.05");
  t.end();
});

tap.test(`config is an object with key without "rules" key`, (t) => {
  const linter = new Linter();
  t.throws(() => {
    linter.verify("a", { a: "z" });
  }, /THROW_ID_02/g);
  t.end();
});
