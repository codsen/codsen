/* eslint-disable no-unused-vars */
import fs from "fs";
import crypto from "crypto";
import { Linter } from "eslint";
import testNum from "../dist/eslint-plugin-test-num.esm.js";
import * as parser from "@typescript-eslint/parser";

export const read = (what, extension = "zz") => {
  return fs.readFileSync(`test/fixtures/${what}.${extension}`, "utf8");
};

export const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

export function verifyAndFix(str, equal) {
  let linter = new Linter({ configType: "flat" });
  let tsLinter = new Linter({ configType: "flat" });

  // ensure that TS parser's result is the same
  equal(
    tsLinter.verifyAndFix(str, {
      plugins: {
        "test-num": testNum,
      },
      rules: {
        "test-num/correct-test-num": "error",
      },
      languageOptions: {
        parser,
      },
    }).output,
    linter.verifyAndFix(str, [
      {
        plugins: {
          "test-num": testNum,
        },
        rules: {
          "test-num/correct-test-num": "error",
        },
      },
    ]).output,
    "verifyAndFix(): the output of ESLint on TS parser is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verifyAndFix(str, [
    {
      plugins: {
        "test-num": testNum,
      },
      rules: {
        "test-num/correct-test-num": "error",
      },
      languageOptions: {
        parser,
      },
    },
  ]);
}

export function verify(str, equal) {
  let linter = new Linter({ configType: "flat" });
  let tsLinter = new Linter({ configType: "flat" });

  // ensure that TS parser's result is the same
  equal(
    tsLinter.verify(str, {
      plugins: {
        "test-num": testNum,
      },
      rules: {
        "test-num/correct-test-num": "error",
      },
      languageOptions: {
        parser,
      },
    }),
    linter.verify(str, [
      {
        plugins: {
          "test-num": testNum,
        },
        rules: {
          "test-num/correct-test-num": "error",
        },
      },
    ]),
    "verify(): the output of ESLint on TS parser is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verify(str, [
    {
      plugins: {
        "test-num": testNum,
      },
      rules: {
        "test-num/correct-test-num": "error",
      },
      languageOptions: {
        parser,
      },
    },
  ]);
}
