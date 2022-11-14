/* eslint-disable no-unused-vars */
import fs from "fs";
import crypto from "crypto";
import { Linter } from "eslint";
import { equal } from "uvu/assert";
import * as parser from "@typescript-eslint/parser";

export const read = (what, extension = "zz") => {
  return fs.readFileSync(`test/fixtures/${what}.${extension}`, "utf8");
};

export const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

export function lint(method, str, config) {
  if (typeof str !== "string") {
    throw new TypeError(
      "ops/helpers/linter.js/main(): first arg must be string!"
    );
  }
  let { rules, plugins } = config;
  let linter = new Linter({
    configType: "flat",
  });
  let methodFn =
    method === "verifyAndFix" ? linter.verifyAndFix : linter.verify;

  // ensure that TS parser's result is the same
  if (method === "verifyAndFix") {
    equal(
      linter.verifyAndFix(str, {
        plugins,
        rules,
        languageOptions: {
          parser,
        },
      }),
      linter.verifyAndFix(str, {
        plugins,
        rules,
      }),
      `${method}(): the output of ESLint on TS parser is not the same as native esprima's!`
    );

    // now just return the output
    return linter.verifyAndFix(str, {
      plugins,
      rules,
      languageOptions: {
        parser,
      },
    });
  } else {
    equal(
      linter.verify(str, {
        plugins,
        rules,
        languageOptions: {
          parser,
        },
      }).output,
      linter.verify(str, {
        plugins,
        rules,
      }).output,
      `${method}(): the output of ESLint on TS parser is not the same as native esprima's!`
    );

    // now just return the output
    return linter.verify(str, {
      plugins,
      rules,
      languageOptions: {
        parser,
      },
    });
  }
}
