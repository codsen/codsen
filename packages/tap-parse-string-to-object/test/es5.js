import tap from "tap";
import { Linter } from "eslint";
import fs from "fs";
import path from "path";
import pack from "../package.json";

tap.test("01 - umd is indeed ES5", (t) => {
  const linter = new Linter();
  try {
    const umdSource = fs.readFileSync(
      path.resolve("dist/tap-parse-string-to-object.umd.js"),
      "utf8"
    );
    const messages = linter.verify(umdSource, {}, { allowInlineConfig: false });
    t.strictSame(messages, [], "01 - umd build is not ES5!");
  } catch (error) {
    console.log(`there's no UMD build!`);
    // is it an issue or not, depends on the "browser" key in package.json
    if (pack.browser) {
      t.fail("dist/tap-parse-string-to-object.umd.js is not present!");
    } else {
      t.pass("dist/tap-parse-string-to-object.umd.js is not present");
    }
  }
  t.end();
});

tap.test("02 - dev.umd is indeed ES5", (t) => {
  const linter = new Linter();
  try {
    const devUmdSource = fs.readFileSync(
      path.resolve("dist/tap-parse-string-to-object.dev.umd.js"),
      "utf8"
    );
    const messages = linter.verify(
      devUmdSource,
      {},
      { allowInlineConfig: false }
    );
    t.strictSame(messages, [], "02 - dev.umd build is not ES5!");
  } catch (error) {
    console.log(`there's no DEV-UMD build!`);
    // is it an issue or not, depends on the "browser" key in package.json
    if (pack.browser) {
      t.fail("dist/tap-parse-string-to-object.dev.umd.js is not present!");
    } else {
      t.pass("dist/tap-parse-string-to-object.dev.umd.js is not present");
    }
  }
  t.end();
});

tap.test("03 - cjs is indeed ES5", (t) => {
  const linter = new Linter();
  const cjsSource = fs.readFileSync(
    path.resolve("dist/tap-parse-string-to-object.cjs.js"),
    "utf8"
  );
  const messages = linter.verify(cjsSource, {}, { allowInlineConfig: false });
  t.strictSame(messages, [], "03 - cjs build is not ES5!");
  t.end();
});
