/* eslint-disable no-prototype-builtins */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const { test } = require("uvu");
// eslint-disable-next-line no-unused-vars
const { equal, is, ok, throws, type, not, match } = require("uvu/assert");
// the CJS imported file can't be ".cjs.js", so we rename temporarily:
fs.renameSync(
  path.resolve("dist/eslint-plugin-row-num.cjs.js"),
  path.resolve("dist/eslint-plugin-row-num.cjs")
);
const api = require("../dist/eslint-plugin-row-num.cjs");

test.after(() => {
  fs.renameSync(
    path.resolve("dist/eslint-plugin-row-num.cjs"),
    path.resolve("dist/eslint-plugin-row-num.cjs.js")
  );
});

// -----------------------------------------------------------------------------

test("01 - object is exported", () => {
  equal(typeof api, "object", "01.01");
});

test("02 - exported object has rules", () => {
  ok(api.hasOwnProperty("rules"), "02.01");
});

test('03 - rule "correct-row-num" is exported', () => {
  ok(api.rules.hasOwnProperty("correct-row-num"), "03.01");
  equal(typeof api.rules["correct-row-num"], "object", "03.02");
  ok(api.rules["correct-row-num"].hasOwnProperty("create"), "03.03");
  equal(typeof api.rules["correct-row-num"].create, "function", "03.04");
});

test.run();
