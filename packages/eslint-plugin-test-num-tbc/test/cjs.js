/* eslint-disable no-prototype-builtins */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require2 = createRequire(import.meta.url);

const { test } = require2("uvu");
/* eslint-disable @typescript-eslint/no-unused-vars */
const { equal, is, ok, throws, type, not, match } = require2("uvu/assert");
// the CJS imported file can't be ".cjs.js", so we rename temporarily:
fs.renameSync(
  path.resolve("dist/eslint-plugin-test-num.cjs.js"),
  path.resolve("dist/eslint-plugin-test-num.cjs"),
);
const api = require2("../dist/eslint-plugin-test-num.cjs");

test.after(() => {
  fs.renameSync(
    path.resolve("dist/eslint-plugin-test-num.cjs"),
    path.resolve("dist/eslint-plugin-test-num.cjs.js"),
  );
});

// -----------------------------------------------------------------------------

test("01 - object is exported", () => {
  equal(typeof api, "object", "01.01");
});

test("02 - exported object has rules", () => {
  ok(api.hasOwnProperty("rules"), "02.01");
});

test('03 - rule "correct-test-num" is exported', () => {
  ok(api.rules.hasOwnProperty("correct-test-num"), "03.01");
  equal(typeof api.rules["correct-test-num"], "object", "03.02");
  ok(api.rules["correct-test-num"].hasOwnProperty("create"), "03.03");
  equal(typeof api.rules["correct-test-num"].create, "function", "03.04");
});

test.run();
