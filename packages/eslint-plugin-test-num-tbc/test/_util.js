import fs from "fs";
import crypto from "crypto";
import { Linter } from "eslint";
import api from "../dist/eslint-plugin-test-num.esm.js";
import * as parser from "@typescript-eslint/parser";

// a common config for linter.verifyAndFix()
export const config = {
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    "test-num/correct-test-num": "error",
  },
};

export const read = (what, extension = "zz") => {
  return fs.readFileSync(`test/fixtures/${what}.${extension}`, "utf8");
};

export const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

export function verifyAndFix(str, equal) {
  // ensure that TS parser's result is the same
  let linter = new Linter();
  linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

  let tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  equal(
    linter.verifyAndFix(str, config),
    tsLinter.verifyAndFix(str, config),
    "the TS parser output is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verifyAndFix(str, config);
}

export function verify(str, equal) {
  // ensure that TS parser's result is the same
  let linter = new Linter();
  linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

  let tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);
  equal(
    linter.verify(str, config),
    tsLinter.verify(str, config),
    "the TS parser output is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verify(str, config);
}
