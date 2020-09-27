import tap from "tap";
import { Linter } from "eslint";
import fs from "fs";
import path from "path";

tap.test("01 - umd is indeed ES5", (t) => {
  const linter = new Linter();
  const umdSource = fs.readFileSync(
    path.resolve("dist/ranges-crop.umd.js"),
    "utf8"
  );
  const messages = linter.verify(umdSource, {}, { allowInlineConfig: false });
  t.strictSame(messages, [], "01 - umd build is not ES5!");
  t.end();
});

tap.test("02 - dev.umd is indeed ES5", (t) => {
  const linter = new Linter();
  const devUmdSource = fs.readFileSync(
    path.resolve("dist/ranges-crop.dev.umd.js"),
    "utf8"
  );
  const messages = linter.verify(
    devUmdSource,
    {},
    { allowInlineConfig: false }
  );
  t.strictSame(messages, [], "02 - dev.umd build is not ES5!");
  t.end();
});

tap.test("03 - cjs is indeed ES5", (t) => {
  const linter = new Linter();
  const cjsSource = fs.readFileSync(
    path.resolve("dist/ranges-crop.cjs.js"),
    "utf8"
  );
  const messages = linter.verify(cjsSource, {}, { allowInlineConfig: false });
  t.strictSame(messages, [], "03 - cjs build is not ES5!");
  t.end();
});
