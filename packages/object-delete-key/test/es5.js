import tap from "tap";
import { Linter } from "eslint";
import fs from "fs";
import path from "path";

// now, it's the time to double-check, is the UMD file really ES5 spec -
// to make sure that no ES6 (or above) features slipped through.
// When we say we ship ES5 UMD build it must be ES5, right?
// So let's test it.
//
// We already have ESLint and theoretically, if we set ESLint to parse ES5,
// any ES6+ code would throw ESLint. We'd wrap the ESLint in an assert and
// check, does it throw. That's the plan.

tap.test("01 - umd is indeed ES5", (t) => {
  const linter = new Linter();
  const UmdSource = fs.readFileSync(
    path.resolve("dist/object-delete-key.umd.js"),
    "utf8"
  );
  const messages = linter.verify(UmdSource);
  t.same(messages, [], "01");
  t.end();
});

tap.test("02 - cjs is indeed ES5", (t) => {
  const linter = new Linter();
  const CjsSource = fs.readFileSync(
    path.resolve("dist/object-delete-key.cjs.js"),
    "utf8"
  );
  const messages = linter.verify(CjsSource);
  t.same(messages, [], "02");
  t.end();
});
