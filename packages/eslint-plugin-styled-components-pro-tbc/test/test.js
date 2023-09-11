/* eslint-disable no-unused-vars */
import { readdirSync, statSync } from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { read, sha256 } from "../../../ops/helpers/common.js";
import { verifyAndFix, verify } from "./_util.js";

// a single test for debugging
// -----------------------------------------------------------------------------

const shas = {
  "01-in.zz":
    "f90732051042fb314254e8cdc76f7d243b9b10fe62708f22df60baf60cd76877",
};

// everything except "output", returned from verifyAndFix(), per each fixture
const expectedOutputs = {
  "01": [
    {
      ruleId: "styled-components-pro/parses-ok",
      severity: 2,
      message: "Unclosed block",
      nodeType: null,
      messageId: "parserMsg",
      line: 5,
      column: 1,
      endLine: 5,
      endColumn: 2,
    },
  ],
};

// loop through all fixtures
// -----------------------------------------------------------------------------

let fixturesPath = path.resolve("./test/fixtures");
readdirSync(fixturesPath)
  .filter(
    (f) =>
      statSync(path.join(fixturesPath, f)).isFile() && f.endsWith("-in.zz"),
  )
  .forEach((file, i) => {
    test(`${file}`, () => {
      let testName = file.slice(0, -6);
      let testIn = read(`${testName}-in`);
      let testOut = read(`${testName}-out`);

      // 1. ensure inputs haven't been mangled
      if (!shas[file]) {
        throw new Error(`${file} new sha: ${sha256(testIn)}`);
      } else if (sha256(testIn) !== shas[file]) {
        throw new Error(
          `#${testName} - ${file} has been mangled, sha should be: ${sha256(
            testIn,
          )}`,
        );
      }

      // 2. ensure we've got something to compare against
      if (!expectedOutputs[testName]) {
        throw new Error(
          `${testName} missing "expected" output to compare against`,
        );
      }

      // 3. ensure "in" is fixed
      let verifiedAndFixed = verifyAndFix(testIn);
      equal(
        verifiedAndFixed[0],
        expectedOutputs[testName][0],
        `#${testName} - verifyAndFix()`,
      );
    });
  });

test.run();
